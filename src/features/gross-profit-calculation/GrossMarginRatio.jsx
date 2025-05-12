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

const GrossProfitRatio = () => {
  const [cost, setCost] = useState("");
  const [sales, setSales] = useState("");
  const [isTaxcluded, setIsExcluded] = useState("1");
  const [grossProfit, setGrossProfit] = useState(0);
  const [grossProfitRatio, setGrossProfitRatio] = useState(0);

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    let parseSales = parseFloat(sales);
    if (isTaxcluded === "2") {
      parseSales = Math.floor(parseFloat(sales / 1.1));
    } else if (isTaxcluded === "3") {
      parseSales = Math.floor(parseFloat(sales / 1.08));
    }
    if (!isNaN(parseCost) && !isNaN(parseSales)) {
      const calculatedGrossProfit = parseSales - parseCost;
      const calculatedGrossProfitRatio =
        Math.round((calculatedGrossProfit / parseSales) * 1000) / 10;
      setGrossProfit(calculatedGrossProfit.toLocaleString());
      setGrossProfitRatio(calculatedGrossProfitRatio);
    } else {
      setGrossProfit(0);
      setGrossProfitRatio(0);
    }
  };

  const handleChange = (value) => {
    setIsExcluded(value);
  };

  const GROSS_MARGIN_RATIO_ITEMS = [
    { label: "原価", type: cost, func: setCost },
    { label: "売上／売価", type: sales, func: setSales },
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
                      borderColor="#aaaaaa"
                      focusBorderColor="teal.400"
                      value={item.type}
                      onChange={(e) => item.func(e.target.value)}
                    />
                    <Text>円</Text>
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
            </Stack>
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="primary"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculationGrossProfit}
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
              粗利益：
            </Text>
            <Stack direction="row" alignItems="center">
              <Text variant="subtitle1" fontSize={36} lineHeight="1">
                {grossProfit}
              </Text>
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                円
              </Text>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" flexWrap="wrap">
            <Text variant="subtitle1" fontSize={20} lineHeight="1">
              （粗利率：
            </Text>
            <Stack direction="row" alignItems="center">
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                {grossProfitRatio}
              </Text>
              <Text variant="subtitle1" fontSize={20} lineHeight="1">
                %）
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

export default GrossProfitRatio;
