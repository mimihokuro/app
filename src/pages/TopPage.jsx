import React from "react";
import { Link } from "react-router-dom";
import {
  PiHouse,
  PiCalculator,
  PiFrameCorners,
  PiTag,
  PiTextT,
  PiHourglass,
  PiQrCode,
  PiCoins,
  PiYoutubeLogo
} from "react-icons/pi";
import TopContents from "../features/top/TopContents";
import usePageMetadata from "../hooks/usePageMetadata";

const TOOLS_DATA = [
  {
    category: "EC / Marketing",
    icon: PiCalculator,
    tools: [
      { id: 'gross-profit', title: "粗利計算ツール", description: "売上高と原価率から、粗利益額や粗利益率などを素早く計算します。", url: "/gross-profit-calculator", icon: PiCalculator },
      { id: 'wholesale-price', title: "卸価格計算ツール", description: "希望小売価格や原価率などから、適切な卸価格や掛率を算出します。", url: "/wholesale-price-calculator", icon: PiCoins },
      { id: 'discount', title: "割引計算ツール", description: "元の価格と割引率から、割引後の価格やお得になった金額を計算します。", url: "/discount-calculator", icon: PiTag },
      { id: 'holiday', title: "休日計算ツール", description: "指定期間内の営業日や土日祝日を除外した休日数を算出します。", url: "/holiday-calculator", icon: PiCalculator },
      { id: 'time-span', title: "期間日時計算ツール", description: "2つの日時の間の経過日数、時間、分、秒などの詳細な差分を計算します。", url: "/time-span-calculator", icon: PiHourglass }
    ]
  },
  {
    category: "Developer Utilities",
    icon: PiFrameCorners,
    tools: [
      { id: 'aspect-ratio', title: "アスペクト比計算ツール", description: "画像の幅や高さからアスペクト比を算出、比率を保ったままリサイズします。", url: "/aspect-ratio-calculator", icon: PiFrameCorners },
      { id: 'qr-code', title: "QRコード生成ツール", description: "入力したURLや文字列から、即座にQRコード画像を生成します。", url: "/qr-code-generator", icon: PiQrCode },
      { id: 'youtube-embed', title: "YouTube埋め込みジェネレーター", description: "動画URLから、レスポンシブ対応したYouTube埋め込みHTMLコードを生成します。", url: "/youtube-embed-generator", icon: PiYoutubeLogo }
    ]
  },
  {
    category: "Design / Text",
    icon: PiTextT,
    tools: [
      { id: 'character-counter', title: "文字数カウントツール", description: "入力したテキストの文字数、行数、バイト数をリアルタイムに計測します。", url: "/character-counter", icon: PiTextT }
    ]
  }
];

const ToolCard = ({ tool }) => {
  const ToolIcon = tool.icon;
  return (
    <Link 
      to={tool.url}
      className="border border-notion-border rounded-lg p-4 cursor-pointer hover:bg-notion-hover transition-all duration-200 group flex flex-col h-full bg-white hover:shadow-md select-none text-left no-underline"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-notion-highlight text-notion-text flex-shrink-0">
          <ToolIcon className="text-xl" />
        </div>
        <h3 className="font-semibold text-notion-text group-hover:underline underline-offset-2 decoration-notion-textLight pt-1 text-sm md:text-base leading-snug">
          {tool.title}
        </h3>
      </div>
      <p className="text-xs md:text-sm text-notion-textLight leading-normal mt-auto pt-2">
        {tool.description}
      </p>
    </Link>
  );
};

const TopPage = () => {
  usePageMetadata({
    title: "ECサイト運営に役立つツールボックス『EC Tool Crate』",
    description: "ECサイトの運営、マーケティング、Web制作に役立つ無料オンラインツール集『EC Tool Crate』。粗利益計算、割引計算、休日計算、文字数カウント、QRコード生成など、毎日の業務を効率化するツールが揃っています。",
    canonicalUrl: "https://ec-tool-crate.com/",
    ogType: "website",
  });

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-2 md:px-6 font-sans text-notion-text">
      {/* Header section (Notion-like page title) */}
      <div className="mb-10 text-left">
        <div className="text-5xl md:text-6xl mb-4 text-notion-text">
          <PiHouse />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">EC Tool Crate</h1>
        <p className="text-notion-textLight text-sm md:text-base">
          ECサイト運営やWeb制作に役立つ便利なツール集です。
        </p>
      </div>

      {/* Grid sections for each category */}
      <div className="space-y-12">
        {TOOLS_DATA.map((cat, idx) => {
          const CategoryIcon = cat.icon;
          return (
            <section key={idx} className="text-left">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-notion-border pb-2">
                <CategoryIcon className="text-notion-textLight text-xl" />
                <span>{cat.category}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* About/Disclaimer sections */}
      <TopContents />
    </div>
  );
};

export default TopPage;
