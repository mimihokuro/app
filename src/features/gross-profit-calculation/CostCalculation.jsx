import {
  Button,
  Grid,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";

const CostCalculation = () => {
  const [sellingPrice, setSellingPrice] = useState("");
  const [isTaxcluded, setIsExcluded] = useState("1");
  const [grossProfit, setGrossProfit] = useState("");
  const [cost, setCost] = useState(0);

  const calculationCost = () => {
    let parseSellingPrice = parseFloat(sellingPrice);
    if (isTaxcluded === "2") {
      parseSellingPrice = parseFloat(parseSellingPrice / 1.1);
    } else if (isTaxcluded === "3") {
      parseSellingPrice = parseFloat(parseSellingPrice / 1.08);
    }
    const parseGrossProfit = parseFloat(grossProfit / 100);
    console.log(parseGrossProfit);
    if (!isNaN(parseSellingPrice) && !isNaN(parseGrossProfit)) {
      const calculatedSellingPrice = Math.floor(
        parseSellingPrice - parseSellingPrice * parseGrossProfit
      );
      setCost(calculatedSellingPrice.toLocaleString());
    } else {
      setCost(0);
    }
  };

  const handleChange = (value) => {
    setIsExcluded(value);
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    {
      label: "売上／売価",
      type: sellingPrice,
      func: setSellingPrice,
      unit: "円",
    },
    {
      label: "粗利率",
      type: grossProfit,
      func: setGrossProfit,
      unit: "%",
    },
  ];

  const TAX_OPTIONS = [
    { label: "税抜", value: "1" },
    { label: "税込", value: "2" },
    { label: "税込(軽減税率)", value: "3" },
  ];

  return (
    <>
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
            {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
              return (
                <Stack key={item.label}>
                  <Text fontSize="14px">{item.label}</Text>
                  <Stack
                    direction="row"
                    alignItems="center"
                    width={"100%"}
                    maxWidth={{ sm: "200px" }}
                  >
                    <Input
                      value={item.type}
                      label={item.label}
                      onChange={(e) => item.func(e.target.value)}
                      borderColor="#aaaaaa"
                      focusBorderColor="teal.400"
                    />
                    <Text variant="subtitle1">{item.unit}</Text>
                  </Stack>
                </Stack>
              );
            })}
            <Stack>
              <Text fontSize="14px">売上／売価の税区分</Text>
              <RadioGroup onChange={handleChange} value={isTaxcluded}>
                <HStack gap="6">
                  {TAX_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            </Stack>{" "}
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="primary"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculationCost}
          >
            計算実行
          </Button>
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
          <Stack direction="row" alignItems="center" flexWrap="wrap">
            <Text variant="subtitle1" fontSize={24} lineHeight="1">
              原価：
            </Text>
            <Stack direction="row" alignItems="center">
              <Text variant="subtitle1" fontSize={36} lineHeight="1">
                {cost}
              </Text>
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                円
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

export default CostCalculation;
