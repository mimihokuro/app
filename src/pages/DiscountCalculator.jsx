import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import DiscountCalculatorTabs from "../features/discount-calculator/DiscountCalculatorTabs";

function DiscountCalculator() {
  usePageMetadata({
    title: "割引計算ツール | EC Tool Crate",
    description:
      "「通常価格とセール価格から割引額・割引率」、「通常価格と割引額・割引率からセール価格」が計算できる割引計算ツールです。",
    canonicalUrl: "https://app.mimihokuro.com/discount-calculator",
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🧮割引計算ツール"}
        pageDescription={
          "「通常価格とセール価格から割引額・割引率」、「通常価格と割引額・割引率からセール価格」が計算できる割引計算ツールです。タブで切り替えてご利用ください。"
        }
      />
      <DiscountCalculatorTabs />
    </Stack>
  );
}

export default DiscountCalculator;
