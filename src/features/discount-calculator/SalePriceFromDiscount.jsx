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
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import { css } from "@emotion/react";
import { useState } from "react";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const SalePriceFromDiscount = () => {
  const [regularPrice, setRegularPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [isSelectOption, setIsSelectOption] = useState("1");
  const [isZeroInRegularPrice, setIsZeroInRegularPrice] = useState(false);
  const [isZeroInDiscount, setIsZeroInDiscount] = useState(false);
  const [discountErrorMessage, setDiscountErrorMessage] = useState("");
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const INPUT_ITEMS = [
    {
      id: "regular-price",
      label: "通常価格",
      type: regularPrice,
      func: setRegularPrice,
      errorMessage: "通常価格が0です",
      isError: isZeroInRegularPrice,
    },
    {
      id: "sale-price",
      label: "割引額・割引率",
      type: discount,
      func: setDiscount,
      errorMessage: discountErrorMessage,
      isError: isZeroInDiscount,
    },
  ];

  const DISCOUNT_OPTIONS = [
    { label: "定額計算（〇円OFF）", value: "1" },
    { label: "定率計算（◯%OFF）", value: "2" },
  ];

  const handleInputNum = (func) => (valueString) => {
    setIsZeroInRegularPrice(false);
    setIsZeroInDiscount(false);
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleChange = (value) => {
    setIsSelectOption(value);
  };

  const calculateDiscount = () => {
    const regular = parseFloat(regularPrice);
    let parseSellingPrice;
    if (
      regular < discount &&
      isSelectOption === "1" &&
      regular !== 0 &&
      discount !== 0
    ) {
      setSalePrice(0);
      toast({
        title: "値引き額が通常価格を上回っています",
        description: "値引き額は通常価格より低く設定してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    } else if (
      isSelectOption === "2" &&
      100 < discount &&
      regular !== 0 &&
      discount !== 0
    ) {
      setSalePrice(0);
      setDiscountErrorMessage("割引率が100%を上回っています");
      setIsZeroInDiscount(true);
    } else if (regular <= 0 || discount <= 0) {
      setSalePrice(0);

      if (regular <= 0) {
        setIsZeroInRegularPrice(true);
      }
      if (discount <= 0) {
        setIsZeroInDiscount(true);
      }
      return;
    } else if (regular === discount) {
      setSalePrice(0);
      toast({
        title: "通常価格と割引値に同じ値が入力されています",
        description: "通常価格と割引値には異なる値を入力してください。",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
    } else if (isSelectOption === "1" && regular !== 0 && discount !== 0) {
      parseSellingPrice = parseFloat(regular - discount);
      setSalePrice(parseSellingPrice);
      toast({
        title: "計算が完了しました",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: toastPosition,
      });
    } else if (
      isSelectOption === "2" &&
      100 >= discount &&
      regular !== 0 &&
      discount !== 0
    ) {
      parseSellingPrice = parseFloat(regular * (1 - discount / 100));
      setSalePrice(parseSellingPrice.toFixed(0));
      toast({
        title: "計算が完了しました",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: toastPosition,
      });
    } else {
      setSalePrice(0);
    }
  };

  const resetForm = () => {
    setRegularPrice(0);
    setDiscount(0);
    setSalePrice(0);
    setIsZeroInRegularPrice(false);
    setIsZeroInDiscount(false);
    setSalePrice(0);
    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

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
        <MainContentsHeading heading={"数値入力"} />
        <HStack
          flexWrap={"wrap"}
          placeItems={"start"}
          gap={6}
          width={"100%"}
          borderRadius={8}
        >
          {INPUT_ITEMS.map((item) => (
            <NumberInputForm
              key={item.id}
              id={item.id}
              label={item.label}
              value={item.type}
              onChange={handleInputNum(item.func)}
              errorMessage={item.errorMessage}
              isInvalid={item.isError}
            />
          ))}
        </HStack>
        <Stack>
          <Text fontWeight={"500"}>割引オプション</Text>
          <RadioGroup
            onChange={handleChange}
            value={isSelectOption}
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
              {DISCOUNT_OPTIONS.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </Stack>
        <ButtonGroup
          display={"grid"}
          gridTemplateColumns={"repeat(2, 1fr)"}
          width={"100%"}
          gap={2}
        >
          <ExecuteButton buttonFunc={calculateDiscount} text="計算する" />
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
        <MainContentsHeading heading={"計算結果"} />
        <HStack flexWrap={"wrap"} gap={4} lineHeight="1">
          <Flex alignItems="end" fontSize={20}>
            <Text as={"span"}>セール価格：</Text>
            <Text fontSize={36} lineHeight="0.75">
              {salePrice}
            </Text>
            <Text as={"span"}>円</Text>
          </Flex>
        </HStack>
      </Stack>
    </Grid>
  );
};

export default SalePriceFromDiscount;
