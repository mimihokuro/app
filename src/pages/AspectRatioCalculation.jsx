import { Heading, Stack, Text } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";

const AspectRatioCalculation = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "アスペクト比を簡単に計算できるツールです。幅と高さから比率を計算したり、比率から幅や高さを計算することができます。",
  });

  return (
    <Stack
      width="100%"
      maxWidth="1024px"
      mx="auto"
      p={{
        base: 4,
        md: "10",
      }}
    >
      <Heading
        as="h1"
        size="xl"
        fontWeight="normal"
        noOfLines={1}
        borderBottom="1px"
        py={2}
        borderBottomColor="#dddddd"
      >
        📐アスペクト比計算ツール
      </Heading>
      <Text mt={2}>
        アスペクト比を簡単に計算できるツールです。幅と高さから比率を計算したり、比率から幅や高さを計算することができます。
      </Text>
      <AspectCalculationTypeTabs />
    </Stack>
  );
};

export default AspectRatioCalculation;
