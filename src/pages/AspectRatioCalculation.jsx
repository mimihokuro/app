import { Heading, Stack, Text } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";

const AspectRatioCalculation = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "粗利益、売価（売上）、原価を計算するためのツールです。自分で計算するのが面倒くさい、計算方法がよくわからないときにお使いください。",
  });

  return (
    <Stack
      width="100%"
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
        💸アスペクト比計算ツール
      </Heading>
      <Text mt={2}>
        粗利益、売価、原価を計算するツールです。タブで切り替えてお使いください。
      </Text>
      <AspectCalculationTypeTabs />
    </Stack>
  );
};

export default AspectRatioCalculation;
