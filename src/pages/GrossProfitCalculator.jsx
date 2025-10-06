import { Stack } from "@chakra-ui/react";
import BasicTabs from "../features/gross-profit-calculation/BasicTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import Ad from "../components/Ad";

const grossProfitToolData = {
  toolName: "粗利率計算ツール",
  description: "3つの簡単なステップで粗利率を計算できます。",
  steps: [
    {
      title: "数値を入力",
      description:
        "「売価」「原価」「粗利率」のそれぞれの入力欄に、計算したい商品の数値を入力してください。",
    },
    {
      title: "「計算する」をクリック",
      description:
        "入力が終わったら、税区分を選び「計算する」ボタンをクリックします。",
    },
    {
      title: "結果を確認",
      description:
        "計算結果が表示されます。入力値を変更すれば、すぐに再計算できます。",
    },
  ],
  example: {
    title: "具体的な計算例",
    scenario:
      "例えば、800円で仕入れた（原価）商品を、1000円で販売した（売価）場合...",
    inputs: [
      { label: "売価", value: "1000", unit: "円" },
      { label: "原価", value: "800", unit: "円" },
    ],
    resultDescription: "計算結果は以下のようになります。",
    result: "粗利: 200円 / 粗利率: 20%",
  },
};

const GrossProfitCalculator = () => {
  usePageMetadata({
    title: "粗利計算ツール | EC Tool Crate",
    description:
      "粗利益（粗利率）、売価（売上）、原価をそれぞれ計算するためのツールです。自分で計算するのが面倒くさい、計算方法がよくわからないときにお使いください。",
    canonicalUrl: "https://app.mimihokuro.com/gross-profit-calculator",
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"💸粗利計算ツール"}
        pageDescription={
          "粗利益（粗利率）、売価、原価を計算するツールです。計算したい数値の種類に合わせてタブを切り替えてお使いください。粗利率は99.9%まで計算できます。"
        }
      />
      <BasicTabs />
      <Ad />
      {/* 1. 粗利率計算ツールの使い方を表示 */}
      <ToolUsageGuide {...grossProfitToolData} />
    </Stack>
  );
};

export default GrossProfitCalculator;
