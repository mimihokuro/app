import {
  Button,
  Grid,
  HStack,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";

const SellingPriceCalculation = () => {
  const [cost, setCost] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
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

  const inputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
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
      <Grid
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={4}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: 1fr 1.5em 1fr;
          }

          grid-template-columns: 1fr;
        `}
      >
        <VStack gap={6} p={6} backgroundColor="#f5f5f5" borderRadius={4}>
          <HStack flexWrap={"wrap"} gap={6} width={"100%"}>
            {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
              return (
                <Stack key={item.label}>
                  <Text fontSize="14px">{item.label}</Text>
                  <Stack
                    direction="row"
                    alignItems="center"
                    width={"100%"}
                    maxWidth={{ sm: "200px" }}
                  >
                    <NumberInput
                      maxWidth={36}
                      value={item.type}
                      onChange={inputNum(item.func)}
                      borderColor="#aaaaaa"
                      focusBorderColor="primary"
                    >
                      <NumberInputField />
                    </NumberInput>
                    <Text>{item.unit}</Text>
                  </Stack>
                </Stack>
              );
            })}
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="primary"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculationGrossProfit}
          >
            計算実行
          </Button>
        </VStack>
        <Text
          fontWeight="bold"
          fontSize={24}
          textAlign={"center"}
          css={css`
            @container parent (min-width: 800px) {
              transform: rotate(90deg);
            }

            transform: rotate(180deg);
          `}
        >
          ▲
        </Text>
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
      </Grid>
    </>
  );
};

export default SellingPriceCalculation;
