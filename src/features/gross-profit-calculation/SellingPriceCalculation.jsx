import {
  ButtonGroup,
  Flex,
  Grid,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const SellingPriceCalculation = () => {
  const [cost, setCost] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [taxIncludedSellingPrice, setTaxIncludedSellingPrice] = useState(0);
  const [isZeroInCost, setIsZeroInCost] = useState(false);
  const [isZeroInGrossProfit, setIsZeroInGrossProfit] = useState(false);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    const parseGrossProfit = grossProfit / 100;
    if (
      parseCost <= 0 ||
      isNaN(parseCost) ||
      parseGrossProfit <= 0 ||
      isNaN(parseGrossProfit)
    ) {
      if (parseCost <= 0 || isNaN(parseCost)) {
        setSellingPrice(0);
        setTaxIncludedSellingPrice(0);
        setIsZeroInCost(true);
      }
      if (parseGrossProfit <= 0 || isNaN(parseGrossProfit)) {
        setSellingPrice(0);
        setTaxIncludedSellingPrice(0);
        setIsZeroInGrossProfit(true);
      }
      return;
    } else if (
      parseCost > 0 &&
      parseGrossProfit > 0 &&
      !isNaN(parseCost) &&
      !isNaN(parseGrossProfit)
    ) {
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
      toast({
        title: "計算が完了しました",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "toastPosition",
      });
    }
  };

  const handleInputNum = (func, id) => (valueString) => {
    setIsZeroInCost(false);
    setIsZeroInGrossProfit(false);
    let value;
    if (id === "gross-profit") {
      value = valueString;
    } else {
      value = parseInt(valueString, 10);
    }
    func(isNaN(value) || value === "" ? 0 : value);
  };

  const resetForm = () => {
    setSellingPrice(0);
    setGrossProfit(0);
    setCost(0);
    setIsZeroInCost(false);
    setIsZeroInGrossProfit(false);
    setTaxIncludedSellingPrice(0);
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
      label: "原価",
      type: cost,
      func: setCost,
      unit: "円",
      errorMessage: "原価が0です",
      isError: isZeroInCost,
    },
    {
      id: "gross-profit",
      label: "粗利率",
      type: grossProfit,
      func: setGrossProfit,
      unit: "%",
      errorMessage: "粗利率が0です",
      isError: isZeroInGrossProfit,
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
                  max={item.id === "gross-profit" ? 99.9 : undefined}
                  unit={item.unit}
                  onChange={handleInputNum(item.func, item.id)}
                  errorMessage={item.errorMessage}
                  isInvalid={item.isError}
                />
              );
            })}
          </HStack>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton
              buttonFunc={calculationGrossProfit}
              text="計算する"
            />
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
