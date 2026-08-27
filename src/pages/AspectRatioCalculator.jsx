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
      "画像・動画・バナー制作において、縦横比（アスペクト比）を保持したままリサイズしたい場合や、任意のピクセル寸法（幅・高さ）から標準比率（16:9、4:3、1:1、9:16など）を判定する計算ツールです。EC商品画像の規定サイズ調整やSNSバナーのトリミングに役立ちます。",
    logicSteps: [
      {
        title: "最大公約数（GCD）によるアスペクト比の判定",
        formula: "アスペクト比 W : H = (幅 ÷ GCD) : (高さ ÷ GCD)",
        description: "画像の幅と高さの最大公約数（Greatest Common Divisor）を求め、最も単純な整数比に約分して比率を算出します。",
        example: "1920px × 1080px の場合 → 最大公約数は120なので (1920÷120) : (1080÷120) = 16 : 9",
      },
      {
        title: "横幅指定による高さのリサイズ逆算",
        formula: "変更後の高さ = 指定した横幅 × (元の高さ ÷ 元の幅)",
        description: "元の画像比率を完全に維持したまま、指定した新しい横幅に対して最適な高さをピクセル単位で算出します。",
        example: "元画像が 1200×800 (3:2) で横幅を600pxにする場合 → 600 × (800÷1200) = 400px",
      },
      {
        title: "高さ指定による横幅のリサイズ逆算",
        formula: "変更後の横幅 = 指定した高さ × (元の幅 ÷ 元の高さ)",
        description: "バナー枠などの高さが固定されている場合に、比率を崩さず収まる横幅を算出します。",
      },
    ],
    benchmarkTable: {
      title: "【主要プラットフォーム別】推奨アスペクト比と標準ピクセルサイズ一覧",
      headers: ["プラットフォーム / 用途", "標準アスペクト比", "推奨ピクセルサイズ", "制作・運用のポイント"],
      rows: [
        [
          "楽天市場（商品メイン画像）",
          "1 : 1（正方形）",
          "700 × 700px 以上（推奨 1000 × 1000px）",
          "白背景画像がガイドラインで推奨。高解像度ディスプレイ向けに1000px以上が標準。",
        ],
        [
          "Amazon（メイン商品画像）",
          "1 : 1（正方形）",
          "1000 × 1000px 〜 2000 × 2000px",
          "1000px以上でズーム機能が有効化。2000px以上はデータが重くなるため1500px前後が最適。",
        ],
        [
          "Instagram（フィード投稿）",
          "1 : 1 または 4 : 5（縦長）",
          "1080 × 1080px / 1080 × 1350px",
          "縦長（4:5）はスマホ画面での占有面積が広く、視認性・エンゲージメントが高い。",
        ],
        [
          "YouTube（動画・サムネイル）",
          "16 : 9（ワイド）",
          "1280 × 720px（最小幅 640px）",
          "ファイルサイズ2MB以下。スマホ表示で右下に再生時間が被るため右下文字配置は避ける。",
        ],
        [
          "TikTok / Instagramリール / YouTubeショート",
          "9 : 16（フルスクリーン縦型）",
          "1080 × 1920px",
          "上下のUI（キャプションやアイコン）と重ならない安全領域（セーフゾーン）内に文字を配置。",
        ],
        [
          "X（旧Twitter）タイムライン画像",
          "16 : 9 または 1.91 : 1",
          "1200 × 675px / 1200 × 630px (OGP)",
          "1枚投稿時は16:9で綺麗にプレビュー表示される。OGPカード画像にも最適。",
        ],
      ],
    },
    proTips: [
      {
        title: "Retina（高精細）ディスプレイ対応のため『等倍の2倍サイズ』で書き出す",
        description:
          "スマホやMacのRetinaディスプレイでは、表示領域（CSSピクセル）の2倍の物理解像度があります。例えば画面上で『幅300px × 高さ300px』で表示させたいバナーは、画像ファイル自体を『600px × 600px』で書き出すことでボヤけず鮮明に表示されます。",
      },
      {
        title: "ピクセル寸法の端数（小数点）による画像の滲み（ボケ）を防ぐ",
        description:
          "リサイズ計算で小数（例: 350.5px）が出た場合、グラフィックソフトでそのまま書き出すと境界線がアンチエイリアス処理されて画像全体がぼやける原因になります。ピクセル値は必ず整数（四捨五入・切り捨て）で統一しましょう。",
      },
      {
        title: "WebP形式への変換で画質を保ったままファイル容量を軽量化",
        description:
          "商品画像やバナーのファイルサイズが重いとWebサイトの表示速度（LCP）が低下しSEO・CVRに悪影響を与えます。JPG/PNGから次世代フォーマットWebP（ウェッピー）に変換することで、同等画質のまま容量を約30〜50%削減できます。",
      },
    ],
    useCases: [
      {
        title: "ECモールの商品サムネイル画像・バナー制作",
        description:
          "楽天市場、Amazon、Yahoo!ショッピング等の出店ガイドラインに準拠した正方形（1:1）画像の作成に。",
      },
      {
        title: "YouTubeサムネイル・OGP画像の比率管理",
        description:
          "動画サムネイル（16:9 / 1280×720）やブログ・記事のSNSシェア用OGP画像（1.91:1 / 1200×630）のリサイズ計算に。",
      },
      {
        title: "レスポンシブWebデザインの画像アセット最適化",
        description:
          "PC用（横長）・スマホ用（縦長・正方形）で切り替えるレスポンシブバナーのサイズ設計に。",
      },
      {
        title: "動画編集・縦型ショート動画の解像度調整",
        description:
          "横型16:9の元動画からTikTok/リール用の9:16（1080×1920）にクロップする際のアスペクト比確認に。",
      },
    ],
    faqs: [
      {
        question: "「アスペクト比」とは具体的に何ですか？",
        answer:
          "画面や画像の「横の長さと縦の長さの比率」のことです。「幅 : 高さ」の比率で表され、数値が同じであればピクセルサイズが異なっても同じ形の四角形（縦横比）になります。",
      },
      {
        question: "アスペクト比を固定せずにリサイズするとどうなりますか？",
        answer:
          "比率を無視して幅や高さを変更すると、被写体（人物や商品）が横に潰れたり縦に伸びたりして不自然な歪みが生じます。商品の魅力を損なわないために比率維持は極めて重要です。",
      },
      {
        question: "4:3 と 16:9 はどちらが一般的ですか？",
        answer:
          "現代のPCモニター、スマートフォン、液晶テレビ、YouTube等の動画プラットフォームは「16:9」が標準（ワイド比率）です。「4:3」は従来のアナログテレビやiPadの画面比率、一部のデジカメ写真で採用されています。",
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
        benchmarkTable={guideData.benchmarkTable}
        proTips={guideData.proTips}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default AspectRatioCalculator;
