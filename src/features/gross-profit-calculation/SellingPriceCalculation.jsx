import {
  Button,
  Flex,
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
import CalculateButton from "../../components/CalculateButton";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

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

  const handleInputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    { id: "cost", label: "原価", type: cost, func: setCost, unit: "円" },
    {
      id: "gross-profit",
      label: "粗利率",
      type: grossProfit,
      func: setGrossProfit,
      unit: "%",
    },
  ];

  return (
    <>
      <Grid
        alignItems="start"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={8}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
          }

          grid-template-columns: 1fr;
        `}
      >
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="数値入力" />
          <HStack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
              return (
                <NumberInputForm
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  value={item.type}
                  unit={item.unit}
                  onChange={handleInputNum(item.func)}
                />
              );
            })}
          </HStack>
          <CalculateButton onClick={calculationGrossProfit} />
        </Stack>
        <Stack
          gap={4}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="計算結果" />
          <Flex alignItems="end" fontSize={24} lineHeight="1">
            <Text as={"span"}>売価：</Text>
            <Text as={"span"} fontSize={36} lineHeight="0.75">
              {taxIncludedSellingPrice}
            </Text>
            <Text as={"span"}>円</Text>
          </Flex>
          <Flex alignItems="end" fontSize={20} lineHeight="1">
            <Text as={"span"}>（税抜：</Text>
            <Text as={"span"} fontSize={24} lineHeight="0.8">
              {sellingPrice}
            </Text>
            <Text as={"span"}>円）</Text>
          </Flex>
        </Stack>
      </Grid>
    </>
  );
};

export default SellingPriceCalculation;
