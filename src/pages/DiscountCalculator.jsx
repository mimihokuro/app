import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import DiscountCalculatorTabs from "../features/discount-calculator/DiscountCalculatorTabs";

function DiscountCalculator() {
  usePageMetadata({
    title: "割引額・割引率計算ツール | EC Tool Crate",
    description:
      "通常価格とセール価格から割引額・割引率、通常価格と割引額・割引率からセール価格が計算できる割引計算ツールです。",
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🧮割引額・割引率計算ツール"}
        pageDescription={
          "通常価格とセール価格から割引額・割引率、通常価格と割引額・割引率からセール価格が計算できる割引計算ツールです。タブで切り替えてご利用ください。"
        }
      />
      <DiscountCalculatorTabs />
    </Stack>
  );
}

export default DiscountCalculator;
