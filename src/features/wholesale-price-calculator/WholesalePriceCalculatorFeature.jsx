import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Badge,
  Divider,
  useToast,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  SimpleGrid,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import {
  FiCopy,
  FiRefreshCw,
  FiCheck,
  FiTrendingUp,
  FiLayers,
  FiTarget,
  FiPackage,
  FiPercent,
} from "react-icons/fi";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

const WholesalePriceCalculatorFeature = () => {
  const toast = useToast();
  const toastPosition = useBreakpointValue({ base: "bottom", md: "top" });

  // ----------------------------------------------------
  // タブ1: 基本計算ステート
  // ----------------------------------------------------
  const [retailPrice, setRetailPrice] = useState(3000); // 上代（小売定価）
  const [costPrice, setCostPrice] = useState(1000); // 仕入・製造原価
  const [rate, setRate] = useState(60); // 掛率 (%)
  const [taxType, setTaxType] = useState("excluded"); // 'excluded' (税抜) | 'included' (税込)
  const [copiedBasic, setCopiedBasic] = useState(false);

  // ----------------------------------------------------
  // タブ2: ロット別試算ステート
  // ----------------------------------------------------
  const [lotRetailPrice, setLotRetailPrice] = useState(3000);
  const [lotCostPrice, setLotCostPrice] = useState(1000);
  const [shippingCost, setShippingCost] = useState(800); // 1注文あたりの送料実費（元払い負担）
  const [lots, setLots] = useState([
    { qty: 10, rate: 65, label: "小ロット (10個)" },
    { qty: 30, rate: 60, label: "標準ロット (30個)" },
    { qty: 50, rate: 55, label: "大口ロット (50個)" },
    { qty: 100, rate: 50, label: "大口まとめ (100個)" },
  ]);
  const [copiedLot, setCopiedLot] = useState(false);

  // ----------------------------------------------------
  // タブ3: 目標粗利から逆算ステート
  // ----------------------------------------------------
  const [targetCostPrice, setTargetCostPrice] = useState(1000); // 原価
  const [targetGrossRate, setTargetGrossRate] = useState(40); // 卸側の目標粗利率 (%)
  const [retailerRate, setRetailerRate] = useState(60); // 小売店への卸掛率 (%)
  const [copiedTarget, setCopiedTarget] = useState(false);

  // ====================================================
  // タブ1: 基本計算ロジック
  // ====================================================
  const basicCalc = useMemo(() => {
    const retail = parseFloat(retailPrice) || 0;
    const cost = parseFloat(costPrice) || 0;
    const rateVal = parseFloat(rate) || 0;

    if (retail <= 0) {
      return {
        isValid: false,
        wholesalePrice: 0,
        wholesalePriceIncTax: 0,
        retailPriceIncTax: 0,
        grossProfit: 0,
        grossProfitRate: 0,
        retailerGrossProfit: 0,
        retailerGrossProfitRate: 0,
        quickRates: [],
      };
    }

    // 下代（卸価格・税抜）
    const wholesalePrice = Math.floor(retail * (rateVal / 100));
    // 税込換算
    const wholesalePriceIncTax = Math.floor(wholesalePrice * 1.1);
    const retailPriceIncTax = Math.floor(retail * 1.1);

    // 卸側の粗利益
    const grossProfit = wholesalePrice - cost;
    const grossProfitRate =
      wholesalePrice > 0 ? (grossProfit / wholesalePrice) * 100 : 0;

    // 小売店（バイヤー）側の粗利益
    const retailerGrossProfit = retail - wholesalePrice;
    const retailerGrossProfitRate = (retailerGrossProfit / retail) * 100;

    // 掛率早見表（50%, 55%, 60%, 65%, 70%, 75%）
    const presetRates = [50, 55, 60, 65, 70, 75];
    const quickRates = presetRates.map((r) => {
      const wPrice = Math.floor(retail * (r / 100));
      const gProfit = wPrice - cost;
      const gRate = wPrice > 0 ? (gProfit / wPrice) * 100 : 0;
      const rProfit = retail - wPrice;
      const rRate = (rProfit / retail) * 100;
      return {
        rate: r,
        wholesalePrice: wPrice,
        wholesalePriceIncTax: Math.floor(wPrice * 1.1),
        grossProfit: gProfit,
        grossProfitRate: Math.round(gRate * 10) / 10,
        retailerGrossProfit: rProfit,
        retailerGrossProfitRate: Math.round(rRate * 10) / 10,
      };
    });

    return {
      isValid: true,
      wholesalePrice,
      wholesalePriceIncTax,
      retailPriceIncTax,
      grossProfit,
      grossProfitRate: Math.round(grossProfitRate * 10) / 10,
      retailerGrossProfit,
      retailerGrossProfitRate: Math.round(retailerGrossProfitRate * 10) / 10,
      quickRates,
    };
  }, [retailPrice, costPrice, rate]);

  // ====================================================
  // タブ2: ロット別試算ロジック
  // ====================================================
  const lotCalc = useMemo(() => {
    const retail = parseFloat(lotRetailPrice) || 0;
    const cost = parseFloat(lotCostPrice) || 0;
    const shipping = parseFloat(shippingCost) || 0;

    if (retail <= 0) return { isValid: false, results: [] };

    const results = lots.map((lot) => {
      const unitWholesale = Math.floor(retail * (lot.rate / 100));
      const totalSales = unitWholesale * lot.qty;
      const totalCost = cost * lot.qty;
      // 粗利総額（送料元払い分を控除）
      const totalGrossProfit = totalSales - totalCost - shipping;
      const grossProfitRate =
        totalSales > 0 ? (totalGrossProfit / totalSales) * 100 : 0;
      const unitGrossProfit = Math.floor(totalGrossProfit / lot.qty);

      return {
        ...lot,
        unitWholesale,
        unitWholesaleIncTax: Math.floor(unitWholesale * 1.1),
        totalSales,
        totalCost,
        totalGrossProfit,
        grossProfitRate: Math.round(grossProfitRate * 10) / 10,
        unitGrossProfit,
      };
    });

    return { isValid: true, results };
  }, [lotRetailPrice, lotCostPrice, shippingCost, lots]);

  // ====================================================
  // タブ3: 目標粗利から逆算ロジック
  // ====================================================
  const targetCalc = useMemo(() => {
    const cost = parseFloat(targetCostPrice) || 0;
    const targetG = parseFloat(targetGrossRate) || 0;
    const retRate = parseFloat(retailerRate) || 0;

    if (cost <= 0 || targetG >= 100 || retRate <= 0) {
      return {
        isValid: false,
        requiredWholesale: 0,
        requiredRetail: 0,
        grossProfit: 0,
        retailerGrossProfit: 0,
      };
    }

    // 目標粗利率を満たす下代: 原価 ÷ (1 - 目標粗利率/100)
    const requiredWholesale = Math.floor(cost / (1 - targetG / 100));
    // その下代になる上代: 下代 ÷ (掛率/100)
    const requiredRetail = Math.floor(requiredWholesale / (retRate / 100));
    const grossProfit = requiredWholesale - cost;
    const retailerGrossProfit = requiredRetail - requiredWholesale;
    const retailerGrossRate = (retailerGrossProfit / requiredRetail) * 100;

    return {
      isValid: true,
      requiredWholesale,
      requiredWholesaleIncTax: Math.floor(requiredWholesale * 1.1),
      requiredRetail,
      requiredRetailIncTax: Math.floor(requiredRetail * 1.1),
      grossProfit,
      retailerGrossProfit,
      retailerGrossRate: Math.round(retailerGrossRate * 10) / 10,
    };
  }, [targetCostPrice, targetGrossRate, retailerRate]);

  // ----------------------------------------------------
  // コピー機能
  // ----------------------------------------------------
  const handleCopyBasic = () => {
    if (!basicCalc.isValid) return;
    const text = `【卸価格（下代）お見積り条件】
■ 上代（希望小売価格）：${Number(retailPrice).toLocaleString()}円（税抜 / 税込 ${basicCalc.retailPriceIncTax.toLocaleString()}円）
■ 掛率（卸率）：${rate}%（${rate / 10}掛け）
━━━━━━━━━━━━━━━━━━━━
■ 下代（卸価格）：${basicCalc.wholesalePrice.toLocaleString()}円（税抜 / 税込 ${basicCalc.wholesalePriceIncTax.toLocaleString()}円）
■ メーカー粗利：${basicCalc.grossProfit.toLocaleString()}円（粗利率 ${basicCalc.grossProfitRate}%）
■ 小売店見込み粗利：${basicCalc.retailerGrossProfit.toLocaleString()}円（粗利率 ${basicCalc.retailerGrossProfitRate}%）
━━━━━━━━━━━━━━━━━━━━
EC Tool Crate | 卸価格計算ツール
https://ec-tool-crate.com/wholesale-price-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBasic(true);
      toast({
        title: "見積りテキストをコピーしました",
        description: "メールや商談チャットにそのまま貼り付けられます。",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedBasic(false), 2000);
    });
  };

  const handleCopyLot = () => {
    if (!lotCalc.isValid) return;
    const lotRows = lotCalc.results
      .map(
        (r) =>
          `・${r.label}：卸単価 ${r.unitWholesale.toLocaleString()}円（${r.rate}%掛）/ 売上総額 ${r.totalSales.toLocaleString()}円 / 粗利総額 ${r.totalGrossProfit.toLocaleString()}円`
      )
      .join("\n");

    const text = `【ロット別卸価格・ボリュームディスカウント条件】
■ 上代（定価）：${Number(lotRetailPrice).toLocaleString()}円（税抜）
■ 仕入原価：${Number(lotCostPrice).toLocaleString()}円
■ 送料負担条件：元払い（送料目安 ${Number(shippingCost).toLocaleString()}円を含む）
━━━━━━━━━━━━━━━━━━━━
${lotRows}
━━━━━━━━━━━━━━━━━━━━
EC Tool Crate | 卸価格計算ツール
https://ec-tool-crate.com/wholesale-price-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedLot(true);
      toast({
        title: "ロット別条件をコピーしました",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedLot(false), 2000);
    });
  };

  const handleCopyTarget = () => {
    if (!targetCalc.isValid) return;
    const text = `【目標利益からの逆算プライシング結果】
■ 仕入・製造原価：${Number(targetCostPrice).toLocaleString()}円（税抜）
■ 自社の目標粗利率：${targetGrossRate}%
■ 卸先の提示掛率：${retailerRate}%（${retailerRate / 10}掛け）
━━━━━━━━━━━━━━━━━━━━
■ 設定すべき卸価格（下代）：${targetCalc.requiredWholesale.toLocaleString()}円（税抜）
■ 設定すべき定価（上代）：${targetCalc.requiredRetail.toLocaleString()}円（税抜）
■ 自社粗利額：${targetCalc.grossProfit.toLocaleString()}円
■ 小売店粗利額：${targetCalc.retailerGrossProfit.toLocaleString()}円（粗利率 ${targetCalc.retailerGrossRate}%）
━━━━━━━━━━━━━━━━━━━━
EC Tool Crate | 卸価格計算ツール
https://ec-tool-crate.com/wholesale-price-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedTarget(true);
      toast({
        title: "逆算結果をコピーしました",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedTarget(false), 2000);
    });
  };

  return (
    <Tabs variant="soft-rounded" colorScheme="green" isLazy>
      <TabList
        bg="gray.100"
        p={1.5}
        borderRadius="xl"
        display="flex"
        gap={2}
        overflowX="auto"
        className="select-none mb-6"
      >
        <Tab
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="bold"
          py={2.5}
          px={4}
          borderRadius="lg"
          _selected={{ bg: "white", color: "green.700", shadow: "sm" }}
        >
          <Flex align="center" gap={1.5}>
            <FiPercent />
            <span>① 基本計算（上代・掛率 ➔ 下代）</span>
          </Flex>
        </Tab>
        <Tab
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="bold"
          py={2.5}
          px={4}
          borderRadius="lg"
          _selected={{ bg: "white", color: "green.700", shadow: "sm" }}
        >
          <Flex align="center" gap={1.5}>
            <FiLayers />
            <span>② ロット別・数量スライド試算</span>
          </Flex>
        </Tab>
        <Tab
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="bold"
          py={2.5}
          px={4}
          borderRadius="lg"
          _selected={{ bg: "white", color: "green.700", shadow: "sm" }}
        >
          <Flex align="center" gap={1.5}>
            <FiTarget />
            <span>③ 目標粗利から逆算プライシング</span>
          </Flex>
        </Tab>
      </TabList>

      <TabPanels>
        {/* ==================================================== */}
        {/* タブ1: 基本計算パネル */}
        {/* ==================================================== */}
        <TabPanel p={0}>
          <Grid
            alignItems="start"
            justifyContent="space-between"
            gap={8}
            css={css`
              @container parent (min-width: 860px) {
                grid-template-columns: 1fr 1fr;
              }
              grid-template-columns: 1fr;
            `}
          >
            {/* 入力フォーム */}
            <Stack
              gap={6}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
            >
              <Flex justify="space-between" align="center">
                <MainContentsHeading heading="条件入力" />
                <Badge colorScheme="green" variant="subtle" px={2.5} py={1} borderRadius="md" fontSize="xs">
                  即時自動計算
                </Badge>
              </Flex>

              <Grid
                gap={5}
                alignItems="start"
                css={css`
                  @container parent (min-width: 480px) {
                    grid-template-columns: 1fr 1fr;
                  }
                  grid-template-columns: 1fr;
                `}
              >
                <NumberInputForm
                  id="retail-price"
                  label="上代・定価（円）"
                  value={retailPrice}
                  min={0}
                  step={100}
                  onChange={(val) => setRetailPrice(parseFloat(val) || 0)}
                  errorMessage="上代を入力してください"
                  isInvalid={retailPrice <= 0}
                />
                <NumberInputForm
                  id="cost-price"
                  label="仕入・原価（円）"
                  value={costPrice}
                  min={0}
                  step={100}
                  onChange={(val) => setCostPrice(parseFloat(val) || 0)}
                  errorMessage="原価を入力してください"
                  isInvalid={costPrice < 0}
                />
              </Grid>

              {/* 掛率入力とプリセット */}
              <Box>
                <Flex justify="space-between" align="center" mb={1.5}>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                    掛率（卸率%）
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    ※ 60% ＝ 6掛け（ろくがけ）
                  </Text>
                </Flex>
                <NumberInputForm
                  id="wholesale-rate"
                  value={rate}
                  min={1}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(val) => setRate(parseFloat(val) || 0)}
                />
                {/* プリセットボタン */}
                <Flex gap={2} mt={2.5} flexWrap="wrap">
                  {[50, 55, 60, 65, 70].map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={rate === r ? "solid" : "outline"}
                      colorScheme={rate === r ? "green" : "gray"}
                      onClick={() => setRate(r)}
                      fontSize={{ base: "xs", md: "sm" }}
                      borderRadius="full"
                      px={3}
                    >
                      {r}% ({r / 10}掛け)
                    </Button>
                  ))}
                </Flex>
              </Box>

              <ButtonGroup width="100%" gap={3} pt={2}>
                <Button
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                  colorScheme="gray"
                  size="lg"
                  width="100%"
                  onClick={() => {
                    setRetailPrice(0);
                    setCostPrice(0);
                    setRate(60);
                  }}
                  borderRadius="lg"
                  fontWeight="medium"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  条件をリセット
                </Button>
              </ButtonGroup>
            </Stack>

            {/* 計算結果エリア */}
            <Stack
              gap={6}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="green.400"
              borderRadius="xl"
              bg="#fbfdfc"
              shadow="sm"
            >
              <Flex justify="space-between" align="center">
                <MainContentsHeading heading="計算結果" />
                <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }} px={3} py={1} borderRadius="full">
                  {rate}% 掛け
                </Badge>
              </Flex>

              {/* メイン結果：下代（卸価格） */}
              <Box
                p={{ base: 5, md: 6 }}
                bg="green.50"
                border="1.5px solid"
                borderColor="green.300"
                borderRadius="xl"
                shadow="xs"
              >
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  color="green.900"
                  className="tracking-wider uppercase"
                >
                  📦 下代（卸価格・提示単価）
                </Text>

                <Flex align="baseline" gap={2} my={3}>
                  <Text
                    fontSize={{ base: "42px", md: "52px" }}
                    fontWeight="800"
                    lineHeight="1"
                    color="green.700"
                    className="font-mono tracking-tight"
                  >
                    {basicCalc.isValid ? basicCalc.wholesalePrice.toLocaleString() : "0"}
                  </Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.700">
                    円（税抜）
                  </Text>
                </Flex>

                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                  税込提示額：<strong>{basicCalc.isValid ? basicCalc.wholesalePriceIncTax.toLocaleString() : "0"} 円</strong>（消費税10%加算）
                </Text>
              </Box>

              {/* 利益内訳カード */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                    自社（メーカー）の粗利
                  </Text>
                  <Flex align="baseline" gap={1.5} my={1}>
                    <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="bold" color="gray.800" className="font-mono">
                      {basicCalc.isValid ? basicCalc.grossProfit.toLocaleString() : "0"}
                    </Text>
                    <Text fontSize="xs" color="gray.600">円</Text>
                  </Flex>
                  <Badge colorScheme="green" variant="subtle" fontSize="11px">
                    粗利率 {basicCalc.isValid ? `${basicCalc.grossProfitRate}%` : "0%"}
                  </Badge>
                </Box>

                <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                    卸先（小売店）の見込み粗利
                  </Text>
                  <Flex align="baseline" gap={1.5} my={1}>
                    <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="bold" color="blue.700" className="font-mono">
                      {basicCalc.isValid ? basicCalc.retailerGrossProfit.toLocaleString() : "0"}
                    </Text>
                    <Text fontSize="xs" color="gray.600">円</Text>
                  </Flex>
                  <Badge colorScheme="blue" variant="subtle" fontSize="11px">
                    粗利率 {basicCalc.isValid ? `${basicCalc.retailerGrossProfitRate}%` : "0%"}
                  </Badge>
                </Box>
              </SimpleGrid>

              {/* ワンクリックコピーボタン */}
              <Button
                leftIcon={copiedBasic ? <FiCheck /> : <FiCopy />}
                colorScheme={copiedBasic ? "green" : "teal"}
                size="lg"
                width="100%"
                onClick={handleCopyBasic}
                borderRadius="xl"
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
                py={6}
                shadow="sm"
                className="transition-all hover:shadow-md"
              >
                {copiedBasic ? "見積り条件をコピーしました！" : "見積り用テキストを1クリックコピー"}
              </Button>
            </Stack>
          </Grid>

          {/* クイック掛率早見表（50%〜75%一覧） */}
          <Box mt={10} p={{ base: 5, md: 7 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" shadow="sm">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" fontSize={{ base: "17px", md: "20px" }} color="gray.900" className="flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" />
                  <span>【掛率早見表】上代 {Number(retailPrice).toLocaleString()}円 に対する掛率別の一覧</span>
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
                  商談中に提示する掛率ごとの下代・粗利額を瞬時に比較できます。
                </Text>
              </Box>
            </Flex>

            <TableContainer border="1px solid" borderColor="gray.200" borderRadius="xl">
              <Table variant="simple" size="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.800" py={3.5} fontSize="13px">掛率（卸率）</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">下代（税抜）</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">下代（税込）</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">自社粗利額（率）</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">小売店見込み利幅</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {basicCalc.quickRates.map((row) => (
                    <Tr key={row.rate} bg={row.rate === rate ? "#f0fdf4" : "transparent"} _hover={{ bg: "#fafaf9" }}>
                      <Td fontWeight="bold" color={row.rate === rate ? "green.700" : "gray.800"}>
                        {row.rate}% ({row.rate / 10}掛け)
                        {row.rate === rate && <Badge ml={2} colorScheme="green" fontSize="10px">選択中</Badge>}
                      </Td>
                      <Td fontFamily="mono" fontWeight="bold" fontSize="15px" color="gray.900">
                        {row.wholesalePrice.toLocaleString()} 円
                      </Td>
                      <Td fontFamily="mono" fontSize="14px" color="gray.600">
                        {row.wholesalePriceIncTax.toLocaleString()} 円
                      </Td>
                      <Td fontSize="14px" color="emerald.700" fontWeight="medium">
                        {row.grossProfit.toLocaleString()} 円 ({row.grossProfitRate}%)
                      </Td>
                      <Td fontSize="14px" color="blue.700">
                        {row.retailerGrossProfit.toLocaleString()} 円 ({row.retailerGrossProfitRate}%)
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ2: ロット別（数量スライド）試算パネル */}
        {/* ==================================================== */}
        <TabPanel p={0}>
          <Grid
            alignItems="start"
            justifyContent="space-between"
            gap={8}
            css={css`
              @container parent (min-width: 860px) {
                grid-template-columns: 1fr 1fr;
              }
              grid-template-columns: 1fr;
            `}
          >
            {/* 入力フォーム */}
            <Stack
              gap={6}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
            >
              <MainContentsHeading heading="基本条件 & 送料設定" />
              <Grid
                gap={4}
                alignItems="start"
                css={css`
                  @container parent (min-width: 480px) {
                    grid-template-columns: 1fr 1fr;
                  }
                  grid-template-columns: 1fr;
                `}
              >
                <NumberInputForm
                  id="lot-retail-price"
                  label="上代・定価（円）"
                  value={lotRetailPrice}
                  min={0}
                  step={100}
                  onChange={(val) => setLotRetailPrice(parseFloat(val) || 0)}
                />
                <NumberInputForm
                  id="lot-cost-price"
                  label="仕入・原価（円）"
                  value={lotCostPrice}
                  min={0}
                  step={100}
                  onChange={(val) => setLotCostPrice(parseFloat(val) || 0)}
                />
              </Grid>

              <Box>
                <Flex justify="space-between" align="center" mb={1.5}>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                    1発送あたりの元払い送料負担（円）
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    ※ 送料無料時の運賃実費
                  </Text>
                </Flex>
                <NumberInputForm
                  id="shipping-cost"
                  value={shippingCost}
                  min={0}
                  step={100}
                  unit="円"
                  onChange={(val) => setShippingCost(parseFloat(val) || 0)}
                />
              </Box>

              <Divider />

              {/* 各ロットの数量と掛率設定 */}
              <Box>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="gray.800" mb={3}>
                  各ロットの数量と掛率（ボリュームディスカウント）
                </Text>
                <Stack gap={3}>
                  {lots.map((lot, idx) => (
                    <Flex key={idx} gap={3} align="center" bg="gray.50" p={2.5} borderRadius="lg">
                      <Box flex="1">
                        <Text fontSize="12px" color="gray.500">発注数量</Text>
                        <NumberInputForm
                          id={`lot-qty-${idx}`}
                          value={lot.qty}
                          min={1}
                          step={5}
                          unit="個"
                          onChange={(val) => {
                            const newLots = [...lots];
                            newLots[idx].qty = parseInt(val, 10) || 1;
                            setLots(newLots);
                          }}
                        />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="12px" color="gray.500">提示掛率</Text>
                        <NumberInputForm
                          id={`lot-rate-${idx}`}
                          value={lot.rate}
                          min={1}
                          max={100}
                          step={1}
                          unit="%"
                          onChange={(val) => {
                            const newLots = [...lots];
                            newLots[idx].rate = parseFloat(val) || 0;
                            setLots(newLots);
                          }}
                        />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Stack>

            {/* 試算結果エリア */}
            <Stack gap={6}>
              <Box p={{ base: 5, md: 7 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" shadow="sm">
                <Flex justify="space-between" align="center" mb={4}>
                  <MainContentsHeading heading="ロット別 利益総額の比較" />
                </Flex>

                <Stack gap={4}>
                  {lotCalc.results.map((r, idx) => (
                    <Box
                      key={idx}
                      p={4}
                      bg={r.totalGrossProfit <= 0 ? "red.50" : idx === lots.length - 1 ? "#f0fdf4" : "white"}
                      border="1.5px solid"
                      borderColor={r.totalGrossProfit <= 0 ? "red.300" : idx === lots.length - 1 ? "green.300" : "gray.200"}
                      borderRadius="xl"
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Badge colorScheme={idx === lots.length - 1 ? "green" : "blue"} fontSize="12px" px={2.5} py={0.5}>
                          {r.qty}個ロット（{r.rate}%掛）
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          1個単価: <strong>{r.unitWholesale.toLocaleString()}円</strong>
                        </Text>
                      </Flex>

                      <Grid templateColumns="repeat(3, 1fr)" gap={2} my={2} textAlign="center">
                        <Box bg="white" p={2} borderRadius="md" border="1px solid" borderColor="gray.100">
                          <Text fontSize="11px" color="gray.500">売上総額</Text>
                          <Text fontSize="15px" fontWeight="bold" color="gray.800" fontFamily="mono">
                            {r.totalSales.toLocaleString()}円
                          </Text>
                        </Box>
                        <Box bg="white" p={2} borderRadius="md" border="1px solid" borderColor="gray.100">
                          <Text fontSize="11px" color="gray.500">自社粗利総額</Text>
                          <Text
                            fontSize="16px"
                            fontWeight="bold"
                            color={r.totalGrossProfit <= 0 ? "red.600" : "green.700"}
                            fontFamily="mono"
                          >
                            {r.totalGrossProfit.toLocaleString()}円
                          </Text>
                        </Box>
                        <Box bg="white" p={2} borderRadius="md" border="1px solid" borderColor="gray.100">
                          <Text fontSize="11px" color="gray.500">実質粗利率</Text>
                          <Text fontSize="15px" fontWeight="bold" color="gray.800" fontFamily="mono">
                            {r.grossProfitRate}%
                          </Text>
                        </Box>
                      </Grid>

                      <Text fontSize="11px" color="gray.500" mt={1}>
                        ※ 送料実費 {Number(shippingCost).toLocaleString()}円 控除後の手元手残り利益
                      </Text>
                    </Box>
                  ))}
                </Stack>

                <Button
                  mt={6}
                  leftIcon={copiedLot ? <FiCheck /> : <FiCopy />}
                  colorScheme={copiedLot ? "green" : "teal"}
                  size="lg"
                  width="100%"
                  onClick={handleCopyLot}
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  py={6}
                >
                  {copiedLot ? "ロット条件をコピーしました！" : "ロット別見積り条件をコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ3: 目標粗利から逆算パネル */}
        {/* ==================================================== */}
        <TabPanel p={0}>
          <Grid
            alignItems="start"
            justifyContent="space-between"
            gap={8}
            css={css`
              @container parent (min-width: 860px) {
                grid-template-columns: 1fr 1fr;
              }
              grid-template-columns: 1fr;
            `}
          >
            {/* 入力フォーム */}
            <Stack
              gap={6}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
            >
              <MainContentsHeading heading="目標条件の入力" />
              <NumberInputForm
                id="target-cost-price"
                label="仕入・原価（円）"
                value={targetCostPrice}
                min={0}
                step={100}
                onChange={(val) => setTargetCostPrice(parseFloat(val) || 0)}
              />
              <NumberInputForm
                id="target-gross-rate"
                label="自社の目標粗利率（%）"
                value={targetGrossRate}
                min={1}
                max={99}
                step={1}
                unit="%"
                onChange={(val) => setTargetGrossRate(parseFloat(val) || 0)}
              />
              <NumberInputForm
                id="retailer-rate"
                label="小売店に提示する卸掛率（%）"
                value={retailerRate}
                min={1}
                max={99}
                step={1}
                unit="%"
                onChange={(val) => setRetailerRate(parseFloat(val) || 0)}
              />
            </Stack>

            {/* 逆算結果エリア */}
            <Stack
              gap={6}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="green.400"
              borderRadius="xl"
              bg="#fbfdfc"
              shadow="sm"
            >
              <MainContentsHeading heading="逆算プライシング結果" />

              {/* 必要な下代 */}
              <Box p={5} bg="green.50" border="1.5px solid" borderColor="green.300" borderRadius="xl">
                <Text fontSize="xs" fontWeight="bold" color="green.900" className="tracking-wider uppercase">
                  ① 設定すべき卸価格（下代）
                </Text>
                <Flex align="baseline" gap={2} my={2}>
                  <Text fontSize={{ base: "36px", md: "44px" }} fontWeight="800" color="green.700" className="font-mono">
                    {targetCalc.isValid ? targetCalc.requiredWholesale.toLocaleString() : "0"}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">円（税抜）</Text>
                </Flex>
                <Text fontSize="xs" color="gray.600">
                  原価 {Number(targetCostPrice).toLocaleString()}円 に対し目標粗利率 {targetGrossRate}% を確実に確保できる単価
                </Text>
              </Box>

              {/* 必要な上代（定価） */}
              <Box p={5} bg="blue.50" border="1.5px solid" borderColor="blue.300" borderRadius="xl">
                <Text fontSize="xs" fontWeight="bold" color="blue.900" className="tracking-wider uppercase">
                  ② 設定すべき希望小売価格（上代）
                </Text>
                <Flex align="baseline" gap={2} my={2}>
                  <Text fontSize={{ base: "36px", md: "44px" }} fontWeight="800" color="blue.700" className="font-mono">
                    {targetCalc.isValid ? targetCalc.requiredRetail.toLocaleString() : "0"}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">円（税抜）</Text>
                </Flex>
                <Text fontSize="xs" color="gray.600">
                  掛率 {retailerRate}%（小売店側の粗利率 {targetCalc.retailerGrossRate}%）を担保する定価
                </Text>
              </Box>

              <Button
                leftIcon={copiedTarget ? <FiCheck /> : <FiCopy />}
                colorScheme={copiedTarget ? "green" : "teal"}
                size="lg"
                width="100%"
                onClick={handleCopyTarget}
                borderRadius="xl"
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
                py={6}
              >
                {copiedTarget ? "逆算結果をコピーしました！" : "逆算結果をコピー"}
              </Button>
            </Stack>
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default WholesalePriceCalculatorFeature;
