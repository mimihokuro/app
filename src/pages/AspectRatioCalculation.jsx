import { Heading, Stack, Text } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";

const AspectRatioCalculation = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "アスペクト比を簡単に計算できるツールです。幅と高さから比率を計算したり、比率から幅や高さを計算することができます。",
  });

  return (
    <Stack width="100%" mx="auto">
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

export default AspectRatioCalculation;
