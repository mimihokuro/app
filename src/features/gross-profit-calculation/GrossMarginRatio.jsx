import {
  ButtonGroup,
  Flex,
  Grid,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import MainContentsHeading from "../../components/MainContentsHeading";
import NumberInputForm from "../../components/NumberInputForm";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const GrossProfitRatio = () => {
  const [cost, setCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [isTaxIncluded, setIsExcluded] = useState("1");
  const [grossProfit, setGrossProfit] = useState(0);
  const [grossProfitRatio, setGrossProfitRatio] = useState(0);
  const [isZeroInCost, setIsZeroInCost] = useState(false);
  const [isZeroInSellingPrice, setIsZeroInSellingPrice] = useState(false);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    let parseSellingPrice = parseFloat(sellingPrice);
    if (
      parseCost <= 0 ||
      isNaN(parseCost) ||
      parseSellingPrice <= 0 ||
      isNaN(parseSellingPrice)
    ) {
      if (parseCost <= 0 || isNaN(parseCost)) {
        setIsZeroInCost(true);
      }
      if (parseSellingPrice <= 0 || isNaN(parseSellingPrice)) {
        setIsZeroInSellingPrice(true);
      }
      return;
    }
    if (parseSellingPrice === parseCost && isTaxIncluded === "1") {
      setGrossProfit(0);
      setGrossProfitRatio(0);
      toast({
        title: "売上／売価と原価が同じです。",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }
    if (isTaxIncluded === "2") {
      parseSellingPrice = Math.floor(parseFloat(sellingPrice / 1.1));
    } else if (isTaxIncluded === "3") {
      parseSellingPrice = Math.floor(parseFloat(sellingPrice / 1.08));
    }
    if (!isNaN(parseCost) && !isNaN(parseSellingPrice)) {
      const calculatedGrossProfit = parseSellingPrice - parseCost;
      const calculatedGrossProfitRatio =
        Math.round((calculatedGrossProfit / parseSellingPrice) * 1000) / 10;
      setGrossProfit(calculatedGrossProfit.toLocaleString());
      setGrossProfitRatio(calculatedGrossProfitRatio);
      toast({
        title: "計算が完了しました",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "toastPosition",
      });
    } else {
      setGrossProfit(0);
      setGrossProfitRatio(0);
    }
  };

  const handleChange = (value) => {
    setIsExcluded(value);
  };

  const handleInputNum = (func) => (valueString) => {
    setIsZeroInSellingPrice(false);
    setIsZeroInCost(false);
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const resetForm = () => {
    setIsExcluded("1");
    setSellingPrice(0);
    setCost(0);
    setGrossProfit(0);
    setGrossProfitRatio(0);
    setIsZeroInSellingPrice(false);
    setIsZeroInCost(false);
    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    {
      id: "cost",
      label: "原価（円）",
      type: cost,
      func: setCost,
      errorMessage: "原価が0です",
      isError: isZeroInCost,
    },
    {
      id: "sellingPrice-price",
      label: "売上／売価（円）",
      type: sellingPrice,
      func: setSellingPrice,
      errorMessage: "売上／売価が0です",
      isError: isZeroInSellingPrice,
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
          <Grid
            css={css`
              @container parent (min-width: 560px) {
                grid-template-columns: repeat(2, 1fr);
              }

              grid-template-columns: 1fr;
            `}
            gap={8}
            width={"100%"}
          >
            {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
              return (
                <NumberInputForm
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  value={item.type}
                  onChange={handleInputNum(item.func)}
                  errorMessage={item.errorMessage}
                  isInvalid={item.isError}
                />
              );
            })}
          </Grid>
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
        <ButtonGroup
          display={"grid"}
          gridTemplateColumns={"repeat(2, 1fr)"}
          width={"100%"}
          gap={4}
        >
          <ExecuteButton buttonFunc={calculationGrossProfit} text="計算する" />
          <ExecuteButton
            icon={<RepeatIcon />}
            variant="outline"
            buttonFunc={resetForm}
            text="リセット"
          />
        </ButtonGroup>
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
