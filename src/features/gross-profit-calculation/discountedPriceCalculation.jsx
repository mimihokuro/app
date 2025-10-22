import {
  ButtonGroup,
  Flex,
  Grid,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const DiscountedPriceCalculation = () => {
  const [originalPrice, setOriginalPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [discountType, setDiscountType] = useState("amount"); // "amount" or "rate"
  const [discountValue, setDiscountValue] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [taxIncludedSalePrice, setTaxIncludedSalePrice] = useState(0);
  const [grossProfitRate, setGrossProfitRate] = useState(0);
  const [isZeroInOriginalPrice, setIsZeroInOriginalPrice] = useState(false);
  const [isZeroInCost, setIsZeroInCost] = useState(false);
  const [isZeroInDiscount, setIsZeroInDiscount] = useState(false);
  const [originalPriceType, setOriginalPriceType] = useState("tax-in"); // "tax-in", "tax-reduced"
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const calculate = () => {
    // 入力の通常価格は「税込」または「税込(軽減税率)」のみ対応
    const priceIn = parseFloat(originalPrice);
    const cst = parseFloat(cost);
    let discountIn = parseFloat(discountValue);

    setIsZeroInOriginalPrice(false);
    setIsZeroInCost(false);
    setIsZeroInDiscount(false);

    if (!priceIn || priceIn <= 0) {
      setIsZeroInOriginalPrice(true);
      setSalePrice(0);
      setTaxIncludedSalePrice(0);
      setGrossProfitRate(0);
      return;
    }
    if (!cst || cst < 0) {
      setIsZeroInCost(true);
      setSalePrice(0);
      setTaxIncludedSalePrice(0);
      setGrossProfitRate(0);
      return;
    }
    if (!discountIn || discountIn < 0) {
      setIsZeroInDiscount(true);
      setSalePrice(0);
      setTaxIncludedSalePrice(0);
      setGrossProfitRate(0);
      return;
    }

    // セール価格（税込）計算（入力は税込前提または軽減税込）
    let saleIn = 0;
    if (discountType === "amount") {
      saleIn = priceIn - discountIn;
    } else {
      saleIn = priceIn - Math.floor(priceIn * (discountIn / 100));
    }
    if (saleIn < 0) saleIn = 0;

    // セール価格（税抜）計算（標準税率または軽減税率に応じて分岐）
    let saleEx = 0;
    if (originalPriceType === "tax-in") {
      saleEx = Math.floor(saleIn / 1.1);
    } else {
      // tax-reduced
      saleEx = Math.floor(saleIn / 1.08);
    }

    // 粗利率計算（税抜きベース）
    const grossProfit = saleEx - cst;
    const grossProfitRate =
      saleEx > 0 ? Math.floor((grossProfit / saleEx) * 1000) / 10 : 0;

    setSalePrice(saleEx.toLocaleString());
    setTaxIncludedSalePrice(saleIn.toLocaleString());
    setGrossProfitRate(grossProfitRate);

    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  const handleInputNum = (func, id) => (valueString) => {
    if (id === "discount-rate") {
      func(valueString);
    } else {
      const value = parseInt(valueString, 10);
      func(isNaN(value) || valueString === "" ? 0 : value);
    }
    setIsZeroInOriginalPrice(false);
    setIsZeroInCost(false);
    setIsZeroInDiscount(false);
  };

  const resetForm = () => {
    setOriginalPrice(0);
    setCost(0);
    setDiscountValue(0);
    setSalePrice(0);
    setTaxIncludedSalePrice(0);
    setGrossProfitRate(0);
    setIsZeroInOriginalPrice(false);
    setIsZeroInCost(false);
    setIsZeroInDiscount(false);
    setDiscountType("amount");
    setOriginalPriceType("tax-in");
    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

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
          gap={8}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="数値入力" />
          <Grid
            grid-template-columns={"repeat(2, 1fr)"}
            columnGap={8}
            rowGap={4}
            width={"100%"}
          >
            <NumberInputForm
              id="original-price"
              label="通常売価（円）"
              value={originalPrice}
              onChange={handleInputNum(setOriginalPrice, "original-price")}
              errorMessage="通常売価が0です"
              isInvalid={isZeroInOriginalPrice}
            />
            <NumberInputForm
              id="cost"
              label="原価（円）"
              value={cost}
              onChange={handleInputNum(setCost, "cost")}
              errorMessage="原価が0です"
              isInvalid={isZeroInCost}
            />
            <Stack gridColumn={"span 2"} gap={0}>
              <Text fontWeight={"500"}>売価の税区分</Text>
              <RadioGroup
                value={originalPriceType}
                onChange={setOriginalPriceType}
                display="flex"
                gap={4}
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
                <Radio value="tax-in">税込</Radio>
                <Radio value="tax-reduced">税込(軽減税率)</Radio>
              </RadioGroup>
            </Stack>
          </Grid>
          <Stack gap={4}>
            <Stack gap={0}>
              <Text fontWeight="500" mb={1}>
                値引き方法
              </Text>
              <RadioGroup
                value={discountType}
                onChange={setDiscountType}
                display="flex"
                gap={4}
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
                <Radio value="amount">定額値引き</Radio>
                <Radio value="rate">定率値引き</Radio>
              </RadioGroup>
            </Stack>
            <Stack gap={0}>
              {discountType === "amount" ? (
                <NumberInputForm
                  id="discount-amount"
                  label="値引き額（円）"
                  value={discountValue}
                  onChange={handleInputNum(setDiscountValue, "discount-amount")}
                  errorMessage="値引き額が0です"
                  isInvalid={isZeroInDiscount}
                />
              ) : (
                <NumberInputForm
                  id="discount-rate"
                  label="値引き率（%）"
                  value={discountValue}
                  max={99.9}
                  onChange={handleInputNum(setDiscountValue, "discount-rate")}
                  errorMessage="値引き率が0です"
                  isInvalid={isZeroInDiscount}
                />
              )}
            </Stack>
          </Stack>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={4}
          >
            <ExecuteButton buttonFunc={calculate} text="計算する" />
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
            <Text as={"span"}>セール価格：</Text>
            <Text as={"span"} fontSize={36} lineHeight="0.75">
              {taxIncludedSalePrice}
            </Text>
            <Text as={"span"}>円</Text>
          </Flex>
          <Flex alignItems="end" fontSize={20} lineHeight="1">
            <Text as={"span"}>（税抜：</Text>
            <Text as={"span"} fontSize={24} lineHeight="0.8">
              {salePrice}
            </Text>
            <Text as={"span"}>円）</Text>
          </Flex>
          <Flex alignItems="center" fontSize={18} lineHeight="1">
            <Text as={"span"}>粗利率：</Text>
            <Text as={"span"} fontSize={24} fontWeight="bold" color="teal.600">
              {grossProfitRate}
            </Text>
            <Text as={"span"}>%</Text>
          </Flex>
        </Stack>
      </Grid>
    </>
  );
};

export default DiscountedPriceCalculation;
