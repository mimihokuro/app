import {
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import NumberInputForm from "../../components/NumberInputForm";
import { useState } from "react";
import { css } from "@emotion/react";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const DiscountFromPrices = () => {
  const [regularPrice, setRegularPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [discountRate, setDiscountRate] = useState("-");
  const [discountAmount, setDiscountAmount] = useState("-");
  const [isZeroInRegularPrice, setIsZeroInRegularPrice] = useState(false);
  const [isZeroInSalePrice, setIsZeroInSalePrice] = useState(false);
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
      label: "セール価格",
      type: salePrice,
      func: setSalePrice,
      errorMessage: "セール価格が0です",
      isError: isZeroInSalePrice,
    },
  ];

  const handleInputNum = (func) => (valueString) => {
    setIsZeroInRegularPrice(false);
    setIsZeroInSalePrice(false);
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const calculateDiscount = () => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);

    if (regular > sale && regular !== 0 && sale !== 0) {
      const discount = regular - sale;
      const rate = (discount / regular) * 100;
      setDiscountAmount(discount.toFixed(0));
      setDiscountRate(rate.toFixed(1));
      toast({
        title: "計算が完了しました",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: toastPosition,
      });
    } else if (regular < sale && regular !== 0 && sale !== 0) {
      setDiscountAmount("-");
      setDiscountRate("-");
      toast({
        title: "セール価格が通常価格を上回っています",
        description: "セール価格は通常価格より低く設定してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
    } else if (regular <= 0 || sale <= 0) {
      setDiscountAmount("-");
      setDiscountRate("-");

      if (regular <= 0) {
        setIsZeroInRegularPrice(true);
      }
      if (sale <= 0) {
        setIsZeroInSalePrice(true);
      }
      return;
    } else if (regular === sale) {
      setDiscountAmount("-");
      setDiscountRate("-");
      toast({
        title: "通常価格とセール価格が同じです",
        description: "通常価格とセール価格には異なる値を入力してください。",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
    } else {
      setDiscountAmount("-");
      setDiscountRate("-");
    }
  };

  const resetForm = () => {
    setRegularPrice(0);
    setSalePrice(0);
    setIsZeroInRegularPrice(false);
    setIsZeroInSalePrice(false);
    setDiscountRate("-");
    setDiscountAmount("-");
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
  );
};

export default DiscountFromPrices;
