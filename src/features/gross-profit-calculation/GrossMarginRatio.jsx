import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const GrossProfitRatio = () => {
  const [cost, setCost] = useState("");
  const [sales, setSales] = useState("");
  const [grossProfit, setGrossProfit] = useState(0);
  const [grossProfitRatio, setGrossProfitRatio] = useState(0);

  const calculationGrossProfit = () => {
    const parseCost = parseFloat(cost);
    const parseSales = parseFloat(sales);
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

  const GROSS_MARGIN_RATIO_ITEMS = [
    { label: "原価", type: cost, func: setCost },
    { label: "売上／売価（税抜）", type: sales, func: setSales },
  ];

  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <Stack spacing={4} backgroundColor="#f5f5f5" borderRadius={8} p={2}>
          {GROSS_MARGIN_RATIO_ITEMS.map((item) => {
            return (
              <Stack key={item.label}>
                <Text fontSize="14px">{item.label}</Text>
                <Stack
                  direction="row"
                  alignItems="center"
                  maxWidth={{ sm: "160px" }}
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
        </Stack>
        <Text
          fontWeight="bold"
          fontSize={24}
          transform={{ base: "rotate(90deg)", sm: "rotate(0deg)" }}
        >
          ＞
        </Text>{" "}
        <Button
          fontWeight="bold"
          variant="filled"
          backgroundColor="teal.400"
          color="#ffffff"
          sx={{ fontSize: "20px" }}
          onClick={calculationGrossProfit}
        >
          計算実行
        </Button>
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
      </Stack>
    </>
  );
};

export default GrossProfitRatio;
