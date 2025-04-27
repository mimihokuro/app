import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const SellingPriceCalculation = () => {
  const [cost, setCost] = useState("");
  const [grossProfit, setGrossProfit] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);
  const [taxIncludedSellingPrice, setTaxIncludedSellingPrice] = useState(0);

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    const parseGrossProfit = parseFloat(grossProfit / 100);
    if (!isNaN(parseCost) && !isNaN(parseGrossProfit)) {
      const calculatedSellingPrice = Math.floor(
        parseCost / (1 - parseGrossProfit)
      );
      const calculatedTaxIncludedSellingPrice = Math.floor(
        calculatedSellingPrice * 1.1
      );
      setSellingPrice(calculatedSellingPrice.toLocaleString());
      setTaxIncludedSellingPrice(
        calculatedTaxIncludedSellingPrice.toLocaleString()
      );
    } else {
      setSellingPrice(0);
      setTaxIncludedSellingPrice(0);
    }
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    { label: "原価", type: cost, func: setCost, unit: "円" },
    {
      label: "粗利率",
      type: grossProfit,
      func: setGrossProfit,
      unit: "%",
    },
  ];

  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <Stack spacing={4} backgroundColor="#f5f5f5" borderRadius={2} p={2}>
          {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
            return (
              <Stack key={item.label}>
                <Text fontSize="14px">{item.label}</Text>
                <Stack
                  direction="row"
                  alignItems="center"
                  maxWidth={{ sm: "160px" }}
                >
                  <Input
                    borderColor="#aaaaaa"
                    focusBorderColor="teal.400"
                    value={item.type}
                    onChange={(e) => item.func(e.target.value)}
                  />
                  <Text>{item.unit}</Text>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
        <Text
          fontWeight="bold"
          fontSize={24}
          transform={{ base: "rotate(90deg)", sm: "rotate(0deg)" }}
        >
          ＞
        </Text>
        <Button
          fontWeight="bold"
          variant="filled"
          backgroundColor="teal.400"
          color="#ffffff"
          sx={{ fontSize: "20px" }}
          onClick={calculationGrossProfit}
        >
          計算実行
        </Button>
        <Stack
          flexGrow={1}
          borderRadius={8}
          gap={1}
          py={4}
          px={2}
          sx={{
            width: { xs: "100%", sm: "initial" },
            mt: { xs: "2rem", sm: "0" },
            ml: { xs: "0", sm: "2rem" },
          }}
          backgroundColor="#f0f0f0"
          justifyContent="center"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" flexWrap="wrap">
            <Text variant="subtitle1" fontSize={24} lineHeight="1">
              売価：
            </Text>
            <Stack direction="row" alignItems="center">
              <Text variant="subtitle1" fontSize={36} lineHeight="1">
                {taxIncludedSellingPrice}
              </Text>
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                円
              </Text>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" flexWrap="wrap">
            <Text variant="subtitle1" fontSize={20} lineHeight="1">
              （税抜：
            </Text>
            <Stack direction="row" alignItems="center">
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                {sellingPrice}
              </Text>
              <Text variant="subtitle1" fontSize={20} lineHeight="1">
                円）
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default SellingPriceCalculation;
