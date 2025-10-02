import { Stack } from "@chakra-ui/react";
import BasicTabs from "../features/gross-profit-calculation/BasicTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import Ad from "../components/Ad";

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
      <ToolUsageGuide />
    </Stack>
  );
};

export default GrossProfitCalculator;
