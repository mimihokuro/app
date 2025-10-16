import {
  ButtonGroup,
  Flex,
  Grid,
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

// 卸売掛率計算ツール
const WholesalePriceCalculation = () => {
  const [retailPrice, setRetailPrice] = useState(0); // 上代（小売価格）
  const [wholesalePrice, setWholesalePrice] = useState(0); // 下代（卸価格）
  const [cost, setCost] = useState(0); // 原価
  const [rateType, setRateType] = useState("from-rate"); // "from-rate" or "from-gross"
  const [rate, setRate] = useState(0); // 掛率
  const [grossProfit, setGrossProfit] = useState(0); // 粗利額
  const [grossProfitRate, setGrossProfitRate] = useState(0); // 粗利率
  const [isZeroInRetailPrice, setIsZeroInRetailPrice] = useState(false);
  const [isZeroInWholesalePrice, setIsZeroInWholesalePrice] = useState(false);
  const [isZeroInRate, setIsZeroInRate] = useState(false);
  const [isZeroInCost, setIsZeroInCost] = useState(false);
  const [isZeroInGrossProfitRate, setIsZeroInGrossProfitRate] = useState(false);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const calculate = () => {
    setIsZeroInRetailPrice(false);
    setIsZeroInWholesalePrice(false);
    setIsZeroInRate(false);
    setIsZeroInCost(false);
    setIsZeroInGrossProfitRate(false);

    // 上代・掛率・原価から下代と粗利率・粗利額を計算
    const retail = parseFloat(retailPrice);
    const rateValue = parseFloat(rate);
    const costValue = parseFloat(cost);

    if (!retail || retail <= 0) {
      setIsZeroInRetailPrice(true);
      setWholesalePrice(0);
      setGrossProfitRate(0);
      setGrossProfit(0);
      return;
    }
    if (!rateValue || rateValue <= 0) {
      setIsZeroInRate(true);
      setWholesalePrice(0);
      setGrossProfitRate(0);
      setGrossProfit(0);
      return;
    }
    if (!costValue || costValue < 0) {
      setIsZeroInCost(true);
      setWholesalePrice(0);
      setGrossProfitRate(0);
      setGrossProfit(0);
      return;
    }

    const wholesale = Math.floor(retail * (rateValue / 100));
    const grossProfitValue = wholesale - costValue;
    const grossRate =
      wholesale > 0
        ? Math.floor((grossProfitValue / wholesale) * 1000) / 10
        : 0;

    setWholesalePrice(wholesale.toLocaleString());
    setGrossProfitRate(grossRate);
    setGrossProfit(grossProfitValue.toLocaleString());

    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };
  const handleInputNum = (func, id) => (valueString) => {
    const value = parseFloat(valueString);
    func(isNaN(value) || valueString === "" ? 0 : value);
    setIsZeroInRetailPrice(false);
    setIsZeroInWholesalePrice(false);
    setIsZeroInRate(false);
    setIsZeroInCost(false);
    setIsZeroInGrossProfitRate(false);
  };
  const resetForm = () => {
    setRetailPrice(0);
    setWholesalePrice(0);
    setRate(0);
    setCost(0);
    setGrossProfitRate(0);
    setGrossProfit(0);
    setIsZeroInRetailPrice(false);
    setIsZeroInWholesalePrice(false);
    setIsZeroInRate(false);
    setIsZeroInCost(false);
    setIsZeroInGrossProfitRate(false);
    setRateType("from-rate");
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
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="数値入力" />
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
            <NumberInputForm
              id="retail-price"
              label="上代（小売価格・円）"
              value={retailPrice}
              onChange={handleInputNum(setRetailPrice, "retail-price")}
              errorMessage="上代が0です"
              isInvalid={isZeroInRetailPrice}
            />
            <NumberInputForm
              id="cost"
              label="原価（円）"
              value={cost}
              onChange={handleInputNum(setCost, "cost")}
              errorMessage="原価が0です"
              isInvalid={isZeroInCost}
            />
            <NumberInputForm
              id="rate"
              label="掛率（%）"
              value={rate}
              max={100}
              onChange={handleInputNum(setRate, "rate")}
              errorMessage="掛率が0です"
              isInvalid={isZeroInRate}
            />
          </Grid>
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
            <Text as={"span"}>下代（卸価格）：</Text>
            <Text as={"span"} fontSize={36} lineHeight="0.75" color="primary">
              {wholesalePrice}
            </Text>
            <Text as={"span"}>円</Text>
          </Flex>
          <Flex alignItems="center" gap={4}>
            <Flex alignItems="center" fontSize={20} lineHeight="1">
              <Text as={"span"}>粗利額：</Text>
              <Text as={"span"} fontSize={24}>
                {grossProfit}
              </Text>
              <Text as={"span"}>円</Text>
            </Flex>
            <Flex alignItems="center" fontSize={20} lineHeight="1">
              <Text as={"span"}>粗利率：</Text>
              <Text as={"span"} fontSize={24}>
                {grossProfitRate}
              </Text>
              <Text as={"span"}>%</Text>
            </Flex>
          </Flex>
        </Stack>
      </Grid>
    </>
  );
};

export default WholesalePriceCalculation;
