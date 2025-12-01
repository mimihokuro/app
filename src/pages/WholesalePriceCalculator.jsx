import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";
import WholesalePriceCalculation from "../features/wholesale-price-calculator/wholesalePriceCalculation";

const wholesalePriceCalculationToolData = {
  toolName: "卸価格計算ツール",
  description:
    "簡単なステップで「下代（卸価格）」「粗利額（粗利率）」を計算できます。",
  steps: [
    {
      title: "数値を入力",
      description:
        "「上代（小売価格）」「原価」「粗利率」の必要な入力欄に、計算したい数値を入力してください。",
    },
    {
      title: "「計算する」をクリック",
      description:
        "入力が終わり、「計算する」ボタンをクリックすると、計算結果が表示されます。",
    },
  ],
  // example: {
  //   title: "具体的な計算例",
  //   scenario:
  //     "",
  //   inputs: [
  //     { label: "売価", value: "1000", unit: "円" },
  //     { label: "原価", value: "800", unit: "円" },
  //   ],
  //   resultDescription: "計算結果は以下のようになります。",
  //   result: "粗利: 200円 （粗利率: 20%）",
  // },
};

const WholesalePriceCalculator = () => {
  usePageMetadata({
    title: "卸価格計算ツール | EC Tool Crate",
    description:
      "上代（小売価格）、原価、掛率から下代（卸価格）と粗利額（粗利率）を計算するツールです。EC運営や小売業の方に最適。",
    canonicalUrl: "https://app.mimihokuro.com/wholesale-price-calculator",
    ogTitle: "卸価格計算ツール | EC Tool Crate",
    ogDescription:
      "上代（小売価格）、原価、掛率から下代（卸価格）と粗利額（粗利率）を計算するツールです。EC運営や小売業の方に最適。",
    ogType: "website" 
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"💸卸価格計算ツール"}
        pageDescription={
          "上代（小売価格）、原価、掛率から下代（卸価格）と粗利額（粗利率）を計算するツールです。EC運営や小売業の方に最適。"
        }
      />
      <ToolUsageGuideAnchor />

      <WholesalePriceCalculation />
      <ToolUsageGuide {...wholesalePriceCalculationToolData} />
    </Stack>
  );
};

export default WholesalePriceCalculator;
