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
import MainContentsHeading from "../../components/MainContentsHeading";
import NumberInputForm from "../../components/NumberInputForm";

const GrossProfitRatio = () => {
  const [cost, setCost] = useState(0);
  const [sales, setSales] = useState(0);
  const [isTaxIncluded, setIsExcluded] = useState("1");
  const [grossProfit, setGrossProfit] = useState(0);
  const [grossProfitRatio, setGrossProfitRatio] = useState(0);

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    let parseSales = parseFloat(sales);
    if (isTaxIncluded === "2") {
      parseSales = Math.floor(parseFloat(sales / 1.1));
    } else if (isTaxIncluded === "3") {
      parseSales = Math.floor(parseFloat(sales / 1.08));
    }
    if (!isNaN(parseCost) && !isNaN(parseSales)) {
      const calculatedGrossProfit = parseSales - parseCost;
      const calculatedGrossProfitRatio =
        Math.round((calculatedGrossProfit / parseSales) * 1000) / 10;
      setGrossProfit(calculatedGrossProfit.toLocaleString());
      setGrossProfitRatio(calculatedGrossProfitRatio);
    } else {
      setGrossProfit(0);
      setGrossProfitRatio(0);
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
    { id: "cost", label: "原価", type: cost, func: setCost, unit: "円" },
    {
      id: "sales-price",
      label: "売上／売価",
      type: sales,
      func: setSales,
      unit: "円",
    },
  ];

  const TAX_OPTIONS = [
    { label: "税抜", value: "1" },
    { label: "税込", value: "2" },
    { label: "税込(軽減税率)", value: "3" },
  ];

  return (
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
              <HStack gap={6}>
                {TAX_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          </Stack>
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
          <Text as={"span"}>粗利益：</Text>
          <Text as={"span"} fontSize={36} lineHeight="0.75">
            {grossProfit}
          </Text>
          <Text as={"span"}>円</Text>
        </Flex>
        <Flex alignItems="end" fontSize={20} lineHeight="1">
          <Text as={"span"}>（粗利率：</Text>
          <Text as={"span"} fontSize={24} lineHeight="0.8">
            {grossProfitRatio}
          </Text>
          <Text as={"span"}>%）</Text>
        </Flex>
      </Stack>
    </Grid>
  );
};

export default GrossProfitRatio;
