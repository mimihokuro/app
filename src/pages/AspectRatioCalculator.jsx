import { Stack } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";

const AspectRatioCalculator = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "アスペクト比を簡単に計算できるツールです。幅と高さから比率を計算したり、比率から幅や高さを計算することができます。",
    canonicalUrl: "https://app.mimihokuro.com/aspect-ratio-calculator",
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📐アスペクト比計算ツール"}
        pageDescription={
          "アスペクト比を簡単に計算できるツールです。幅と高さから比率を計算したり、比率から幅や高さを計算することができます。"
        }
      />
      <AspectCalculationTypeTabs />
    </Stack>
  );
};

export default AspectRatioCalculator;
