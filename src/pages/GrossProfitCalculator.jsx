import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import BasicTabs from "../features/gross-profit-calculation/BasicTabs";
import ToolGuideSection from "../components/ToolGuideSection";

function GrossProfitCalculator() {
  usePageMetadata({
    title: "粗利計算ツール（粗利益額・粗利益率） | EC Tool Crate",
    description:
      "売上高と原価率・原価額から、粗利益額や粗利益率などを素早く計算します。ECサイトの商品値付けや売上計画、粗利率の試算に役立つ無料計算ツールです。",
    canonicalUrl: "https://ec-tool-crate.com/gross-profit-calculator",
    ogTitle: "粗利計算ツール（粗利益額・粗利益率） | EC Tool Crate",
    ogDescription:
      "売上高と原価率・原価額から、粗利益額や粗利益率などを素早く計算します。",
    ogType: "website"
  });

  const guideData = {
    title: "粗利計算ツール",
    summary:
      "粗利（売上総利益）は、事業やEC店舗の収益性を測る最も基本かつ重要な指標です。当ツールでは、売上高・仕入れ原価・目標粗利率・割引価格などの条件に合わせて、販売価格の決定や必要な利益額の算出を簡単に行えます。",
    logicSteps: [
      {
        title: "粗利益額（売上総利益）の計算",
        formula: "粗利益額 = 売上高 - 仕入原価",
        description: "商品の販売価格（売上高）から、直接かかった仕入れ原価を差し引いた金額です。",
        example: "販売価格 10,000円、仕入原価 6,000円 の場合 → 10,000 - 6,000 = 粗利益額 4,000円",
      },
      {
        title: "粗利益率（粗利率%）の計算",
        formula: "粗利益率(%) = (粗利益額 ÷ 売上高) × 100",
        description: "売上高に占める粗利益の割合を示します。利益率が高いほど収益構造が優れていると判断されます。",
        example: "売上高 10,000円、粗利益額 4,000円 の場合 → (4,000 ÷ 10,000) × 100 = 粗利益率 40%",
      },
      {
        title: "目標粗利益率から販売価格を計算（マークアップ率）",
        formula: "必要な販売価格 = 仕入原価 ÷ (1 - 目標粗利益率 ÷ 100)",
        description:
          "「原価が3,000円の商品で40%の粗利益率を確保したい」場合に、いくらで販売すべきかを逆算します。",
        example: "原価 3,000円、目標粗利率 40% の場合 → 3,000 ÷ (1 - 0.4) = 販売価格 5,000円",
      },
    ],
    useCases: [
      {
        title: "ECサイトの新商品値付け・プライシング",
        description:
          "仕入れ値や製造コストに対して、プラットフォーム手数料や配送コストを考慮した目標利益率が確保できる販売価格の試算に。",
      },
      {
        title: "セール・値引き時の下限価格チェック",
        description:
          "赤字（原価割れ）や利益率の急低下を防ぐため、どこまでの値引きなら許容できるかの限界利益ラインの把握に。",
      },
      {
        title: "月次・年次の売上・利益予算計画",
        description:
          "目標とする粗利益額を達成するために必要な総売上高や、平均販売単価のシミュレーションに活用できます。",
      },
    ],
    faqs: [
      {
        question: "「粗利益（売上総利益）」と「営業利益」の違いは何ですか？",
        answer:
          "粗利益は「売上高 - 原価」で算出される純粋な商品の利益です。一方、営業利益は粗利益からさらに販売管理費（人件費、家賃、広告費、通信費など）を差し引いた、本業の最終的な利益を指します。",
      },
      {
        question: "ECモール（楽天・Amazon等）の手数料は原価に含めるべきですか？",
        answer:
          "販売に直接比例して発生する決済手数料やモール販売手数料は、仕入原価に含めて「売上原価」として計算するか、目標粗利益率を高めに設定して試算するのが一般的です。",
      },
      {
        question: "一般的なECサイトの平均粗利益率はどのくらいですか？",
        answer:
          "取扱商材によりますが、型番商品（家電・仕入れ品）で20%〜40%、オリジナル商品（D2C・アパレル・自社開発品）で50%〜80%程度が一般的な目安とされています。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"💰 粗利計算ツール"}
        pageDescription={
          "売上高と原価率・原価額から、粗利益額や粗利益率などを素早く計算します。タブを切り替えて各項目を算出してください。"
        }
      />
      <BasicTabs />
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

export default GrossProfitCalculator;
