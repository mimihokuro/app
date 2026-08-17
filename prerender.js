import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "dist");
const PORT = 5174;

// プリレンダリング対象のルート一覧
const ROUTES = [
  "/",
  "/holiday-calculator",
  "/gross-profit-calculator",
  "/aspect-ratio-calculator",
  "/discount-calculator",
  "/character-counter",
  "/time-span-calculator",
  "/qr-code-generator",
  "/wholesale-price-calculator",
  "/youtube-embed-generator",
  "/privacy-policy",
  "/contact",
  "/about",
];

// 簡易MIMEタイプマップ
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// distディレクトリを配信する静的サーバー（SPAフォールバック付き）
function startServer(templateHtml) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split("?")[0];
      
      // 静的アセット（JS, CSS, 画像等）へのリクエスト
      if (urlPath.startsWith("/assets/") || urlPath.includes(".")) {
        const filePath = path.join(DIST_DIR, urlPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "application/octet-stream";
          fs.readFile(filePath, (err, content) => {
            if (err) {
              res.writeHead(500);
              res.end(`Server Error: ${err.code}`);
            } else {
              res.writeHead(200, { "Content-Type": contentType });
              res.end(content);
            }
          });
          return;
        }
      }

      // ルートやページリクエストには常に初期テンプレートHTMLを返す (SPAルーティング実行のため)
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(templateHtml, "utf-8");
    });

    server.listen(PORT, () => {
      console.log(`[Prerender] Local server started at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("[Prerender Error] dist directory not found. Please run 'vite build' first.");
    process.exit(1);
  }

  const rawIndexHtmlPath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(rawIndexHtmlPath)) {
    console.error("[Prerender Error] dist/index.html not found.");
    process.exit(1);
  }
  const templateHtml = fs.readFileSync(rawIndexHtmlPath, "utf-8");

  const server = await startServer(templateHtml);
  console.log("[Prerender] Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // プリレンダリング中の外部広告・解析スクリプトをブロック（HTMLのスクリプト汚染を防止）
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("googlesyndication.com") ||
        url.includes("googleadservices.com") ||
        url.includes("doubleclick.net") ||
        url.includes("googletagmanager.com") ||
        url.includes("google-analytics.com")
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log(`[Browser Console Error] ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      console.log(`[Browser Page Error] ${err.toString()}`);
    });

    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`[Prerender] Rendering: ${route} (${url})`);

      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
        // #root の中にコンテンツがレンダリングされるのを待つ
        await page.waitForFunction(() => {
          const root = document.getElementById("root");
          return root && root.children.length > 0;
        }, { timeout: 10000 });
      } catch (e) {
        console.warn(`  [Warning] Timeout waiting for content on ${route}:`, e.message);
      }

      // レンダリング・アニメーションの完了を確実にするため少し待機
      await new Promise((r) => setTimeout(r, 600));

      // HTMLコンテンツを取得
      let html = await page.content();

      // 出力先パスの決定
      let outputDir;
      let outputFile;
      if (route === "/") {
        outputDir = DIST_DIR;
        outputFile = path.join(DIST_DIR, "index.html");
      } else {
        const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
        outputDir = path.join(DIST_DIR, cleanRoute);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        outputFile = path.join(outputDir, "index.html");
      }

      fs.writeFileSync(outputFile, html, "utf-8");
      console.log(`  ✓ Saved static HTML to: ${path.relative(DIST_DIR, outputFile)} (${(html.length / 1024).toFixed(1)} KB)`);
    }

    console.log("[Prerender] All routes successfully prerendered!");
  } catch (err) {
    console.error("[Prerender Error]", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

prerender();
