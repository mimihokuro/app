import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Heading,
  Stack,
  HStack,
  Grid,
} from "@chakra-ui/react";
import { useState } from "react";

function DiscountCalculator() {
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  const calculateDiscount = () => {
    if (regularPrice && salePrice) {
      const regular = parseFloat(regularPrice);
      const sale = parseFloat(salePrice);

      if (regular > sale) {
        const discount = regular - sale;
        const rate = (discount / regular) * 100;
        setDiscountAmount(discount.toFixed(2));
        setDiscountRate(rate.toFixed(2));
      } else if (regular === sale) {
        setDiscountAmount("0.00");
        setDiscountRate("0.00");
      } else {
        setDiscountAmount("エラー: セール価格が通常価格より高くなっています");
        setDiscountRate("エラー: セール価格が通常価格より高くなっています");
      }
    } else {
      setDiscountAmount("");
      setDiscountRate("");
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
        border="1px #dddddd solid"
        mt={4}
        p={4}
        borderRadius={8}
      >
        <HStack
          flexWrap={"wrap"}
          gap={6}
          p={6}
          backgroundColor="#f5f5f5"
          borderRadius={4}
        >
          <FormControl>
            <FormLabel htmlFor="regular-price">通常価格</FormLabel>
            <Input
              id="regular-price"
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              maxWidth={40}
              borderColor="#aaaaaa"
              focusBorderColor="primary"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="sale-price">セール価格</FormLabel>
            <Input
              id="sale-price"
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              maxWidth={40}
              borderColor="#aaaaaa"
              focusBorderColor="primary"
            />
          </FormControl>
        </HStack>
        <Button
          colorScheme="teal.400"
          backgroundColor={"primary"}
          onClick={calculateDiscount}
        >
          計算実行
        </Button>

        {(discountRate || discountAmount) && (
          <Box mt={4}>
            {discountAmount.startsWith("エラー") ? (
              <Text color="red">{discountAmount}</Text>
            ) : (
              <>
                <Text fontSize="lg">
                  割引額: <Text as="b">{discountAmount}円</Text>
                </Text>
                <Text fontSize="lg">
                  割引率: <Text as="b">{discountRate}%</Text>
                </Text>
              </>
            )}
          </Box>
        )}
      </Grid>
    </Stack>
  );
}

export default DiscountCalculator;
