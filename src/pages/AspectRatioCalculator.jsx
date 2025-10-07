import { Stack } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";

const AspectRatioCalculator = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "アスペクト比を簡単に計算できるツールです。幅と高さから縦横比率を計算したり、縦横比率から幅や高さを計算することができます。",
    canonicalUrl: "https://app.mimihokuro.com/aspect-ratio-calculator",
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📐アスペクト比計算ツール"}
        pageDescription={
          "アスペクト比を簡単に計算できるツールです。幅と高さから縦横比率を計算したり、縦横比率から幅や高さを計算することができます。"
        }
      />
      <ToolUsageGuideAnchor />
      <AspectCalculationTypeTabs />
    </Stack>
  );
};

export default AspectRatioCalculator;
