import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import ToolGuideSection from "../components/ToolGuideSection";

function AspectRatioCalculator() {
  usePageMetadata({
    title: "アスペクト比計算ツール（画像比率・リサイズ） | EC Tool Crate",
    description:
      "画像の横幅や縦幅からアスペクト比（画面比率）を自動計算し、比率を維持したままリサイズ時のピクセルサイズを算出します。ECバナーやSNS画像、動画の縦横比調整に最適です。",
    canonicalUrl: "https://ec-tool-crate.com/aspect-ratio-calculator",
    ogTitle: "アスペクト比計算ツール（画像比率・リサイズ） | EC Tool Crate",
    ogDescription:
      "画像の横幅や縦幅からアスペクト比（画面比率）を自動計算し、比率を維持したままリサイズ時のサイズを算出します。",
    ogType: "website"
  });

  const guideData = {
    title: "アスペクト比計算ツール",
    summary:
      "画像や動画の縦横比（アスペクト比）を保持したまま指定のサイズへリサイズしたい場合や、任意のピクセル数（幅・高さ）から標準的な比率（16:9や4:3など）を判定する計算ツールです。",
    logicSteps: [
      {
        title: "アスペクト比の算出（最大公約数 GCD）",
        formula: "比率 W : H = (幅 ÷ GCD) : (高さ ÷ GCD)",
        description: "幅と高さのピクセル数の最大公約数を求め、最小の整数比に約分して比率を求めます。",
        example: "1920px × 1080px の場合 → GCDは120なので (1920÷120) : (1080÷120) = 16 : 9",
      },
      {
        title: "比率維持のリサイズ計算",
        formula: "新高さ = 新幅 × (元高さ ÷ 元幅)",
        description: "元の縦横比率を維持したまま、変更後の幅に対する最適な高さを算出します。",
      },
    ],
    useCases: [
      {
        title: "ECモールのメイン画像・サブ画像の制作",
        description:
          "楽天市場（1:1 正方形）やAmazon、Yahoo!ショッピング等の指定画像サイズに合わせたリサイズ寸法の計算に。",
      },
      {
        title: "Youtubeサムネイル・SNS画像サイズ調整",
        description:
          "YouTube（16:9 / 1280×720）、Instagram（1:1 または 4:5）、X (Twitter)（16:9）などの最適な縦横比の計算。",
      },
    ],
    faqs: [
      {
        question: "代表的なアスペクト比にはどのような種類がありますか？",
        answer:
          "「16:9（ワイド・YouTubeやテレビ）」「4:3（従来のアナログテレビやデジタルカメラ）」「1:1（正方形・InstagramやEC商品画像）」「9:16（縦長動画・TikTokやYouTubeショート）」などが代表的です。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📐 アスペクト比計算ツール"}
        pageDescription={
          "画像の幅や高さからアスペクト比を算出、または比率を保ったまま指定サイズへリサイズするためのツールです。"
        }
      />
      <AspectCalculationTypeTabs />
      <ToolGuideSection
        title={guideData.title}
        summary={guideData.summary}
        logicSteps={guideData.logicSteps}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default AspectRatioCalculator;
