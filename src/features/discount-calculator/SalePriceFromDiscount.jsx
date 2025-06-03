import {
  Flex,
  Grid,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import NumberInputForm from "../../components/NumberInputForm";
import DisplayAlert from "../../components/DisplayAlert";
import MainContentsHeading from "../../components/MainContentsHeading";
import { css } from "@emotion/react";
import { useState } from "react";
import ExecuteButton from "../../components/ExecuteButton";

const SalePriceFromDiscount = () => {
  const [regularPrice, setRegularPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [isSelectOption, setIsSelectOption] = useState("1");
  const [isInputZeroValueFlag, setIsInputZeroValueFlag] = useState(false);
  const [isOverValueFlag, setIsOverValueFlag] = useState(false);
  const [isOverMaxFlag, setIsOverMaxFlag] = useState(false);
  const [isSameValueFlag, setIsSameValueFlag] = useState(false);

  const INPUT_ITEMS = [
    {
      id: "regular-price",
      label: "通常価格",
      type: regularPrice,
      func: setRegularPrice,
    },
    {
      id: "sale-price",
      label: "割引額・割引率",
      type: discount,
      func: setDiscount,
    },
  ];

  const DISCOUNT_OPTIONS = [
    { label: "定額計算（〇円OFF）", value: "1" },
    { label: "定率計算（◯%OFF）", value: "2" },
  ];

  const handleInputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleChange = (value) => {
    setIsSelectOption(value);
  };

  const handleInputFlag = () => {
    if (isInputZeroValueFlag) {
      setIsInputZeroValueFlag(false);
    }
    if (isOverValueFlag) {
      setIsOverValueFlag(false);
    }
    if (isOverMaxFlag) {
      setIsOverMaxFlag(false);
    }
    if (isSameValueFlag) {
      setIsSameValueFlag(false);
    }
  };

  const calculateDiscount = () => {
    handleInputFlag();
    const regular = parseFloat(regularPrice);
    let parseSellingPrice;
    if (
      regular < discount &&
      isSelectOption === "1" &&
      regular !== 0 &&
      discount !== 0
    ) {
      setIsOverValueFlag(true);
      setSalePrice("-");
    } else if (
      isSelectOption === "2" &&
      100 < discount &&
      regular !== 0 &&
      discount !== 0
    ) {
      setIsOverMaxFlag(true);
      setSalePrice("-");
    } else if (regular === 0 || discount === 0) {
      setIsInputZeroValueFlag(true);
      setSalePrice("-");
    } else if (regular === discount) {
      setIsSameValueFlag(true);
      setSalePrice("-");
    } else if (isSelectOption === "1" && regular !== 0 && discount !== 0) {
      parseSellingPrice = parseFloat(regular - discount);
      setSalePrice(parseSellingPrice);
    } else if (
      isSelectOption === "2" &&
      100 >= discount &&
      regular !== 0 &&
      discount !== 0
    ) {
      parseSellingPrice = parseFloat(regular * (1 - discount / 100));
      setSalePrice(parseSellingPrice);
    } else {
      console.log("else");
      setSalePrice("-");
    }
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

        <ExecuteButton buttonFunc={calculateDiscount} text="計算する" />
        {isInputZeroValueFlag && (
          <DisplayAlert status="error" message="値に0が入力されています" />
        )}
        {isOverValueFlag && (
          <DisplayAlert
            status="error"
            message="割引額が通常価格を上回っています"
          />
        )}
        {isOverMaxFlag && (
          <DisplayAlert status="error" message="割引率が100%を上回っています" />
        )}
        {isSameValueFlag && (
          <DisplayAlert
            status="warning"
            message="通常価格と割引値に同じ値が入力されています"
          />
        )}
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
