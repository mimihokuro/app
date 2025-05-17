import {
  FormControl,
  FormLabel,
  Button,
  Text,
  Heading,
  Stack,
  Grid,
  NumberInput,
  NumberInputField,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import usePageMetadata from "../hooks/usePageMetadata";
import { css } from "@emotion/react";

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
    <Stack>
      <Heading
        as="h1"
        size="lg"
        fontWeight="normal"
        noOfLines={1}
        borderBottom="1px"
        py={2}
        borderBottomColor="#dddddd"
      >
        🧮割引額・割引率計算ツール
      </Heading>
      <Text mt={2}>
        通常価格とセール価格を入力して計算実行すると割引額と割引率が計算されます。
      </Text>
      <Grid
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={4}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: 1fr 1.5em 1fr;
          }

          grid-template-columns: 1fr;
        `}
      >
        <VStack gap={6} p={6} backgroundColor="#f5f5f5" borderRadius={4}>
          <HStack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            {INPUT_ITEMS.map((item, index) => (
              <FormControl key={index} maxWidth={36}>
                <FormLabel htmlFor={item.id}>{item.label}</FormLabel>
                <NumberInput
                  id={item.id}
                  value={item.type}
                  borderColor="#aaaaaa"
                  focusBorderColor="primary"
                  onChange={handleInputNum(item.func)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            ))}
          </HStack>
          <Button
            width="100%"
            colorScheme="teal.400"
            backgroundColor={"primary"}
            onClick={calculateDiscount}
          >
            計算実行
          </Button>
          {isInputZeroValueFlag && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>価格に0が入力されています</AlertDescription>
            </Alert>
          )}
          {isCalculateValueFlag && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                セール価格が通常価格を上回っています
              </AlertDescription>
            </Alert>
          )}
          {isSameValueFlag && (
            <Alert status="warning">
              <AlertIcon />
              <AlertDescription>
                通常価格とセール価格に同じ値が入力されています
              </AlertDescription>
            </Alert>
          )}
        </VStack>
        <Text
          fontWeight="bold"
          fontSize={24}
          textAlign={"center"}
          css={css`
            @container parent (min-width: 800px) {
              transform: rotate(90deg);
            }

            transform: rotate(180deg);
          `}
        >
          ▲
        </Text>
        <Stack
          flexGrow={1}
          borderRadius={8}
          gap={1}
          py={4}
          px={2}
          sx={{
            width: { xs: "100%", sm: "initial" },
            mt: { xs: "2rem", sm: "0" },
            ml: { xs: "0", sm: "2rem" },
          }}
          backgroundColor="#f0f0f0"
          justifyContent="center"
          alignItems="center"
        >
          <Stack alignItems="center" flexWrap="wrap">
            <Stack direction="row" alignItems="center">
              <Text fontSize={20} lineHeight="1">
                割引額：
              </Text>
              <Text fontSize={36} lineHeight="1">
                {discountAmount}
              </Text>
              <Text fontSize={20} lineHeight="1">
                円
              </Text>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text fontSize={20} lineHeight="1">
                割引率：
              </Text>
              <Text fontSize={36} lineHeight="1">
                {discountRate}
              </Text>
              <Text fontSize={20} lineHeight="1">
                %
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Stack>
  );
}

export default DiscountCalculator;
