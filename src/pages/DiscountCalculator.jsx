import { Text, Stack, Grid, HStack, Heading, Flex } from "@chakra-ui/react";
import { useState } from "react";
import usePageMetadata from "../hooks/usePageMetadata";
import { css } from "@emotion/react";
import NumberInputForm from "../components/NumberInputForm";
import CalculateButton from "../components/CalculateButton";
import DisplayAlert from "../components/DisplayAlert";
import PageTitle from "../components/PageTitle";

function DiscountCalculator() {
  usePageMetadata({
    title: "割引額・割引率計算ツール | EC Tool Crate",
    description:
      "通常価格とセール価格を入力して計算実行すると割引額と割引率が計算されます。",
  });

  const [regularPrice, setRegularPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [discountRate, setDiscountRate] = useState("-");
  const [discountAmount, setDiscountAmount] = useState("-");
  const [isInputZeroValueFlag, setIsInputZeroValueFlag] = useState(false);
  const [isCalculateValueFlag, setIsCalculateValueFlag] = useState(false);
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
      label: "セール価格",
      type: salePrice,
      func: setSalePrice,
    },
  ];

  const handleInputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleInputFlag = () => {
    if (isInputZeroValueFlag) {
      setIsInputZeroValueFlag(false);
    }
    if (isCalculateValueFlag) {
      setIsCalculateValueFlag(false);
    }
    if (isSameValueFlag) {
      setIsSameValueFlag(false);
    }
  };

  const calculateDiscount = () => {
    handleInputFlag();
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);

    if (regular > sale && regular !== 0 && sale !== 0) {
      const discount = regular - sale;
      const rate = (discount / regular) * 100;
      setDiscountAmount(discount.toFixed(0));
      setDiscountRate(rate.toFixed(1));
    } else if (regular < sale && regular !== 0 && sale !== 0) {
      setIsCalculateValueFlag(true);
      setDiscountAmount("-");
      setDiscountRate("-");
    } else if (regular === 0 || sale === 0) {
      setIsInputZeroValueFlag(true);
      setDiscountAmount("-");
      setDiscountRate("-");
    } else if (regular === sale) {
      setIsSameValueFlag(true);
      setDiscountAmount("-");
      setDiscountRate("-");
    } else {
      setDiscountAmount("-");
      setDiscountRate("-");
    }
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🧮割引額・割引率計算ツール"}
        pageDescription={
          "通常価格とセール価格を入力して計算実行すると割引額と割引率が計算されます。"
        }
      />
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
          <Heading
            as={"h2"}
            pb={2}
            fontSize={18}
            borderBottom={"1px solid"}
            borderBottomColor="colorGray"
          >
            数値入力
          </Heading>
          <HStack
            flexWrap={"wrap"}
            placeItems={"start"}
            gap={6}
            width={"100%"}
            p={4}
            backgroundColor="colorGrayLight"
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
          <CalculateButton onClick={calculateDiscount} />
          {isInputZeroValueFlag && (
            <DisplayAlert status="error" message="価格に0が入力されています" />
          )}
          {isCalculateValueFlag && (
            <DisplayAlert
              status="error"
              message="セール価格が通常価格を上回っています"
            />
          )}
          {isSameValueFlag && (
            <DisplayAlert
              status="warning"
              message="通常価格とセール価格に同じ値が入力されています"
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
          <Heading
            as={"h2"}
            pb={2}
            fontSize={18}
            borderBottom={"1px solid"}
            borderBottomColor="colorGray"
          >
            計算結果
          </Heading>
          <HStack flexWrap={"wrap"} gap={4} lineHeight="1">
            <Flex alignItems="end" fontSize={20}>
              <Text as={"span"}>割引額：</Text>
              <Text fontSize={36} lineHeight="0.75">
                {discountAmount}
              </Text>
              <Text as={"span"}>円</Text>
            </Flex>
            <Flex alignItems="end" fontSize={20}>
              <Text as={"span"}>割引率：</Text>
              <Text as={"span"} fontSize={36} lineHeight="0.75">
                {discountRate}
              </Text>
              <Text as={"span"}>%</Text>
            </Flex>
          </HStack>
        </Stack>
      </Grid>
    </Stack>
  );
}

export default DiscountCalculator;
