import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import WholesalePriceCalculation from "../features/wholesale-price-calculator/wholesalePriceCalculation";
import ToolGuideSection from "../components/ToolGuideSection";

function WholesalePriceCalculator() {
  usePageMetadata({
    title: "卸価格計算ツール（掛率・卸単価） | EC Tool Crate",
    description:
      "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を、または仕入原価と目標利益から適切な卸価格を素早く計算します。B2B卸取引や仕入れ交渉に役立つ計算ツールです。",
    canonicalUrl: "https://ec-tool-crate.com/wholesale-price-calculator",
    ogTitle: "卸価格計算ツール（掛率・卸単価） | EC Tool Crate",
    ogDescription:
      "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を素早く計算します。",
    ogType: "website"
  });

  const guideData = {
    title: "卸価格計算ツール",
    summary:
      "メーカーや問屋、EC事業者間で頻繁に行われる卸取引（B2B取引）において、「上代（販売希望価格）」「下代（卸価格）」「掛率（卸率%）」の相互計算を行うツールです。仕入れ原価を割り込まない適正な卸価格の算出や交渉にご利用ください。",
    logicSteps: [
      {
        title: "卸価格（下代）の計算",
        formula: "卸価格(下代) = 希望小売価格(上代) × (掛率 ÷ 100)",
        description: "一般消費者向けの販売希望価格（上代）に対し、指定の掛率（例: 60%＝6掛け）を掛けて卸単価を算出します。",
        example: "上代 10,000円、掛率 65%（65掛け）の場合 → 10,000 × 0.65 = 卸価格 6,500円",
      },
      {
        title: "掛率（卸率%）の計算",
        formula: "掛率(%) = (卸価格 ÷ 希望小売価格) × 100",
        description: "実際の卸価格と上代から、何掛けで取引されているかの割合（掛率）を逆算します。",
        example: "上代 8,000円、卸価格 4,800円 の場合 → (4,800 ÷ 8,000) × 100 = 掛率 60%（6掛け）",
      },
    ],
    useCases: [
      {
        title: "バイヤー・小売店への卸条件提示",
        description:
          "自社オリジナル商品を他社店舗やECモール出店者に卸販売する際、掛率に応じた条件表の作成や価格提示に。",
      },
      {
        title: "メーカー・問屋からの仕入れ原価試算",
        description:
          "仕入れ先から「〇掛けで供給」と提示された際、自社の販売利益がしっかり確保できるかの事前の検算に。",
      },
    ],
    faqs: [
      {
        question: "「上代（じょうだい）」「下代（げだい）」とは何ですか？",
        answer:
          "上代とは一般消費者に販売する「定価・希望小売価格」のことです。下代とはメーカーから小売店へ卸す「卸価格（仕入れ価格）」のことを指します。",
      },
      {
        question: "「6掛け（ろくがけ）」とは何パーセントのことですか？",
        answer:
          "「6掛け」は定価の60%の価格（掛率60%）を意味します。同様に「55掛け」は55%、「7掛け」は70%を指します。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📦 卸価格計算ツール"}
        pageDescription={
          "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を、または卸価格と上代から掛率を計算します。"
        }
      />
      <WholesalePriceCalculation />
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

export default WholesalePriceCalculator;
