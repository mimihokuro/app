import { Heading, Stack, Text } from "@chakra-ui/react";
import BasicTabs from "../features/gross-profit-calculation/BasicTabs";
import usePageMetadata from "../hooks/usePageMetadata";

const GrossProfitCalculation = () => {
  usePageMetadata({
    title: "粗利計算ツール | EC Tool Crate",
    description:
      "粗利益、売価（売上）、原価を計算するためのツールです。自分で計算するのが面倒くさい、計算方法がよくわからないときにお使いください。",
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
        💸粗利計算ツール
      </Heading>
      <Text mt={2}>
        粗利益、売価、原価を計算するツールです。タブで切り替えてお使いください。
      </Text>
      <BasicTabs />
    </Stack>
  );
};

export default GrossProfitCalculation;
