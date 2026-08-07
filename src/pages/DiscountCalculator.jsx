import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import DiscountCalculatorTabs from "../features/discount-calculator/DiscountCalculatorTabs";
import ToolGuideSection from "../components/ToolGuideSection";

function DiscountCalculator() {
  usePageMetadata({
    title: "割引計算ツール | EC Tool Crate",
    description:
      "「通常価格とセール価格から割引額・割引率」、「通常価格と割引額・割引率からセール価格」が計算できる割引計算ツールです。ECセール、バーゲン価格の試算に役立ちます。",
    canonicalUrl: "https://ec-tool-crate.com/discount-calculator",
    ogTitle: "割引計算ツール | EC Tool Crate",
    ogDescription:
      "「通常価格とセール価格から割引額・割引率」、「通常価格と割引額・割引率からセール価格」が計算できる割引計算ツールです。",
    ogType: "website"
  });

  const guideData = {
    title: "割引計算ツール",
    summary:
      "当ツールは、ECサイトのセール価格設定や買い物の割引額試算に最適なオンライン計算計算機です。「定価と値引き後の価格から割引率を求めたい」「◯%引きの時の販売価格を即座に知りたい」といった場面で、タブを切り替えて素早く正確に計算できます。",
    logicSteps: [
      {
        title: "割引後の価格（セール価格）の計算",
        formula: "セール価格 = 定価 × (1 - 割引率 ÷ 100)",
        description:
          "定価に対して指定の割引率（例: 20%OFF）を適用した際の割引後の販売価格を算出します。",
        example: "10,000円の商品が30%引きの場合 → 10,000 × (1 - 0.3) = 7,000円",
      },
      {
        title: "割引率（％OFF）の計算",
        formula: "割引率(%) = (1 - 販売価格 ÷ 定価) × 100",
        description:
          "元の定価と実際の販売価格から、何％オフになっているかの割引割合を逆算します。",
        example: "定価5,000円が3,500円で販売されている場合 → (1 - 3,500 ÷ 5,000) × 100 = 30%引き",
      },
      {
        title: "割引額（おトクになった金額）の計算",
        formula: "割引額 = 定価 - 販売価格",
        description: "定価と販売価格の差額から、実際に値引きされた金額を算出します。",
      },
    ],
    useCases: [
      {
        title: "ECサイトのセール・キャンペーン価格設定",
        description:
          "楽天やYahoo!ショッピング、Amazonのスーパーセール・ブラックフライデー等に向けた値引き価格やポイント還元率の事前試算に。",
      },
      {
        title: "日常のお買い物・バーゲンセール",
        description:
          "ショッピングモールやスーパーのタイムセールで「3割引き」「25%OFF」と表示されている場合の正確な支払額の確認に。",
      },
      {
        title: "アパレル・雑貨等の在庫処分価格の決定",
        description:
          "シーズンオフ商品の売価変更にあたり、原価割れしない適切な値引き額・値引き率の検討に活用できます。",
      },
      {
        title: "見積書・請求書での値引き額の検算",
        description:
          "取引先への提示見積もりや注文書で「端数切り捨て」や「一律割引」を適用した際の割引率のチェックに。",
      },
    ],
    faqs: [
      {
        question: "「◯割引き」と「◯%引き」の違いは何ですか？",
        answer:
          "「1割」は「10%」と同じ意味です。例えば「3割引き」は「30%引き」、「2割5分引き」は「25%引き」となります。当ツールではどちらの単位でも簡単に計算いただけます。",
      },
      {
        question: "消費税込みの価格でも計算できますか？",
        answer:
          "はい、税込み価格・税抜き価格のどちらの数値でもそのまま入力して計算可能です。税込み定価を入力すれば、算出されるセール価格や割引額も税込みの数値となります。",
      },
      {
        question: "計算結果で端数が出た場合はどうなりますか？",
        answer:
          "端数が発生した場合は、一般的に用いられる四捨五入によって小数第2位まで表示されます。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🧮 割引計算ツール"}
        pageDescription={
          "「通常価格とセール価格から割引額・割引率」、「通常価格と割引額・割引率からセール価格」が計算できる割引計算ツールです。タブで切り替えてご利用ください。"
        }
      />
      <DiscountCalculatorTabs />
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

export default DiscountCalculator;
