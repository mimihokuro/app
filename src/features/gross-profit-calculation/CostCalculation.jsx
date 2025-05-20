import {
  Flex,
  Grid,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import CalculateButton from "../../components/CalculateButton";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

const CostCalculation = () => {
  const [sellingPrice, setSellingPrice] = useState(0);
  const [isTaxIncluded, setIsExcluded] = useState("1");
  const [grossProfit, setGrossProfit] = useState(0);
  const [cost, setCost] = useState(0);

  const calculationCost = () => {
    let parseSellingPrice = parseFloat(sellingPrice);
    if (isTaxIncluded === "2") {
      parseSellingPrice = parseFloat(parseSellingPrice / 1.1);
    } else if (isTaxIncluded === "3") {
      parseSellingPrice = parseFloat(parseSellingPrice / 1.08);
    }
    const parseGrossProfit = parseFloat(grossProfit / 100);
    console.log(parseGrossProfit);
    if (!isNaN(parseSellingPrice) && !isNaN(parseGrossProfit)) {
      const calculatedSellingPrice = Math.floor(
        parseSellingPrice - parseSellingPrice * parseGrossProfit
      );
      setCost(calculatedSellingPrice.toLocaleString());
    } else {
      setCost(0);
    }
  };

  const handleChange = (value) => {
    setIsExcluded(value);
  };

  const handleInputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    {
      id: "selling-price",
      label: "売上／売価",
      type: sellingPrice,
      func: setSellingPrice,
      unit: "円",
    },
    {
      id: "gross-profit",
      label: "粗利率",
      type: grossProfit,
      func: setGrossProfit,
      unit: "%",
    },
  ];

  const TAX_OPTIONS = [
    { label: "税抜", value: "1" },
    { label: "税込", value: "2" },
    { label: "税込(軽減税率)", value: "3" },
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
            <Stack>
              <Text fontWeight={"500"}>売上／売価の税区分</Text>
              <RadioGroup
                onChange={handleChange}
                value={isTaxIncluded}
                sx={{
                  "& input:checked + span": {
                    backgroundColor: "primary", // チェック時の背景色
                    borderColor: "primary", // チェック時のボーダー色
                  },
                  "& span": {
                    borderColor: "gray.400", // 未チェック時のボーダー色
                  },
                }}
              >
                <HStack gap={6} rowGap={2} flexWrap={"wrap"}>
                  {TAX_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            </Stack>
          </HStack>
          <CalculateButton onClick={calculationCost} />
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
            <Text as={"span"}>原価：</Text>
            <Text as={"span"} fontSize={36} lineHeight="0.75">
              {cost}
            </Text>
            <Text as={"span"}>円</Text>
          </Flex>
        </Stack>
      </Grid>
    </>
  );
};

export default CostCalculation;
