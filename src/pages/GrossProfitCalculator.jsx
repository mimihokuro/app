import { Stack } from "@chakra-ui/react";
import BasicTabs from "../features/gross-profit-calculation/BasicTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";

const grossProfitToolData = {
  toolName: "粗利計算ツール",
  description:
    "3つの簡単なステップで「売価」「原価」「粗利率」を計算できます。",
  steps: [
    {
      title: "計算したい数値の種類からタブを選択",
      description:
        "粗利益（粗利率）、売価、原価のそれぞれを計算するためのタブが用意されています。計算したい数値の種類に合わせてタブを選択してください。（セール価格から粗利率を計算することも可能です。）",
    },
    {
      title: "数値を入力",
      description:
        "「売価」「原価」「粗利率」の必要な入力欄に、計算したい数値を入力してください。（売上／売価を入力する場合は、税込・税抜といった税区分の選択も行ってください。）",
    },
    {
      title: "「計算する」をクリック",
      description:
        "入力が終わり、「計算する」ボタンをクリックすると、計算結果が表示されます。",
    },
  ],
  example: {
    title: "具体的な計算例",
    scenario:
      "例えば、800円で仕入れた（原価）商品を、1000円で販売したい（売価）場合...",
    inputs: [
      { label: "売価", value: "1000", unit: "円" },
      { label: "原価", value: "800", unit: "円" },
    ],
    resultDescription: "計算結果は以下のようになります。",
    result: "粗利: 200円 （粗利率: 20%）",
  },
};

const GrossProfitCalculator = () => {
  usePageMetadata({
    title: "粗利計算ツール | EC Tool Crate",
    description:
      "粗利益（粗利率）、売価（売上）、原価をそれぞれ計算することができるシンプルで高機能な粗利計算ツールです。EC運営や小売業の方に最適。セール価格と一緒に粗利率を計算することも可能です。",
    canonicalUrl: "https://app.mimihokuro.com/gross-profit-calculator",
    ogTitle: "粗利計算ツール | EC Tool Crate",
    ogDescription:
      "粗利益（粗利率）、売価（売上）、原価をそれぞれ計算することができるシンプルで高機能な粗利計算ツールです。EC運営や小売業の方に最適。セール価格と一緒に粗利率を計算することも可能です。",
    ogType: "website"
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"💸粗利計算ツール"}
        pageDescription={
          "粗利益（粗利率）、売価、原価を計算するツールです。計算したい数値の種類に合わせてタブを切り替えてお使いください。セール価格と粗利率の計算も可能です。"
        }
      />
      <ToolUsageGuideAnchor />

      <BasicTabs />
      <ToolUsageGuide {...grossProfitToolData} />
    </Stack>
  );
};

export default GrossProfitCalculator;
