import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
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
  FiCheck,
  FiPercent,
  FiAward,
  FiLayers,
  FiTrendingDown,
} from "react-icons/fi";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

const DiscountCalculatorFeature = () => {
  const toast = useToast();
  const toastPosition = useBreakpointValue({ base: "bottom", md: "top" });

  // ----------------------------------------------------
  // タブ1: 基本計算ステート
  // ----------------------------------------------------
  const [regularPrice, setRegularPrice] = useState(5000); // 通常価格（定価）
  const [calcMode, setCalcMode] = useState("rate"); // 'rate' (割引率から計算) | 'amount' (割引額から計算) | 'salePrice' (セール価格から逆算)
  const [discountRate, setDiscountRate] = useState(20); // 割引率 (%)
  const [discountAmountInput, setDiscountAmountInput] = useState(1000); // 割引額 (円)
  const [targetSalePrice, setTargetSalePrice] = useState(4000); // セール価格 (円)
  const [taxMode, setTaxMode] = useState("included"); // 'included' (税込表示) | 'excluded' (税抜表示)
  const [copiedBasic, setCopiedBasic] = useState(false);

  // ----------------------------------------------------
  // タブ2: 施策比較ステート（%OFF vs クーポン vs ポイント）
  // ----------------------------------------------------
  const [comparePrice, setComparePrice] = useState(6000); // 比較対象商品の通常価格
  const [compareRate, setCompareRate] = useState(20); // 施策A: %OFF
  const [compareCoupon, setCompareCoupon] = useState(1000); // 施策B: 定額クーポン (円)
  const [comparePointMultiplier, setComparePointMultiplier] = useState(10); // 施策C: ショップ負担ポイント (倍)

  // ----------------------------------------------------
  // タブ3: まとめ買い・バンドル割引ステート
  // ----------------------------------------------------
  const [bundleUnitPrice, setBundleUnitPrice] = useState(2000); // 1個の通常価格
  const [bundleQty, setBundleQty] = useState(3); // 注文数量
  const [bundleType, setBundleType] = useState("percent"); // 'percent' (一括%OFF) | 'second_discount' (2点目以降割引) | 'fixed_set' (セット固定価格)
  const [bundleDiscountRate, setBundleDiscountRate] = useState(15); // 一括割引率 (%)
  const [secondItemRate, setSecondItemRate] = useState(50); // 2点目以降の割引率 (%)
  const [fixedSetPrice, setFixedSetPrice] = useState(5000); // セット固定価格 (円)
  const [copiedBundle, setCopiedBundle] = useState(false);

  // ====================================================
  // タブ1: 基本計算ロジック
  // ====================================================
  const basicCalc = useMemo(() => {
    const regular = parseFloat(regularPrice) || 0;
    if (regular <= 0) {
      return {
        isValid: false,
        salePrice: 0,
        discountAmount: 0,
        actualRate: 0,
        regularWithTax: 0,
        salePriceWithTax: 0,
        regularNoTax: 0,
        salePriceNoTax: 0,
        quickRates: [],
      };
    }

    let calculatedSalePrice = 0;
    let calculatedDiscount = 0;
    let calculatedRate = 0;

    if (calcMode === "rate") {
      const r = parseFloat(discountRate) || 0;
      calculatedRate = r;
      calculatedDiscount = Math.round(regular * (r / 100));
      calculatedSalePrice = Math.max(0, regular - calculatedDiscount);
    } else if (calcMode === "amount") {
      const amt = parseFloat(discountAmountInput) || 0;
      calculatedDiscount = Math.min(regular, amt);
      calculatedSalePrice = Math.max(0, regular - calculatedDiscount);
      calculatedRate = regular > 0 ? (calculatedDiscount / regular) * 100 : 0;
    } else {
      // salePrice から逆算
      const target = parseFloat(targetSalePrice) || 0;
      calculatedSalePrice = Math.min(regular, Math.max(0, target));
      calculatedDiscount = Math.max(0, regular - calculatedSalePrice);
      calculatedRate = regular > 0 ? (calculatedDiscount / regular) * 100 : 0;
    }

    // 税込/税抜換算
    const isInc = taxMode === "included";
    const regularWithTax = isInc ? regular : Math.floor(regular * 1.1);
    const salePriceWithTax = isInc ? calculatedSalePrice : Math.floor(calculatedSalePrice * 1.1);
    const regularNoTax = isInc ? Math.floor(regular / 1.1) : regular;
    const salePriceNoTax = isInc ? Math.floor(calculatedSalePrice / 1.1) : calculatedSalePrice;

    // 早見表（5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%, 70%）
    const presetList = [5, 10, 15, 20, 25, 30, 40, 50, 70];
    const quickRates = presetList.map((pRate) => {
      const dAmt = Math.round(regular * (pRate / 100));
      const sPrice = Math.max(0, regular - dAmt);
      return {
        rate: pRate,
        discountAmount: dAmt,
        salePrice: sPrice,
        salePriceWithTax: isInc ? sPrice : Math.floor(sPrice * 1.1),
      };
    });

    return {
      isValid: true,
      salePrice: calculatedSalePrice,
      discountAmount: calculatedDiscount,
      actualRate: Math.round(calculatedRate * 10) / 10,
      regularWithTax,
      salePriceWithTax,
      regularNoTax,
      salePriceNoTax,
      quickRates,
    };
  }, [regularPrice, calcMode, discountRate, discountAmountInput, targetSalePrice, taxMode]);

  // ====================================================
  // タブ2: 施策比較ロジック
  // ====================================================
  const comparisonCalc = useMemo(() => {
    const price = parseFloat(comparePrice) || 0;
    if (price <= 0) return { isValid: false };

    // 施策A: %OFF
    const rateVal = parseFloat(compareRate) || 0;
    const discA = Math.round(price * (rateVal / 100));
    const payA = Math.max(0, price - discA);
    const effectiveRateA = price > 0 ? (discA / price) * 100 : 0;

    // 施策B: 定額クーポン
    const couponVal = parseFloat(compareCoupon) || 0;
    const discB = Math.min(price, couponVal);
    const payB = Math.max(0, price - discB);
    const effectiveRateB = price > 0 ? (discB / price) * 100 : 0;

    // 施策C: ショップ負担ポイント還元
    const multiplier = parseFloat(comparePointMultiplier) || 1;
    const addedPointRate = Math.max(0, multiplier - 1);
    const pointAmount = Math.round(price * (multiplier / 100));
    const storePointCost = Math.round(price * (addedPointRate / 100));
    const customerNetPrice = Math.max(0, price - pointAmount);
    const effectiveRateC = price > 0 ? (pointAmount / price) * 100 : 0;

    return {
      isValid: true,
      price,
      planA: {
        pay: payA,
        discount: discA,
        rate: Math.round(effectiveRateA * 10) / 10,
        storeLoss: discA,
      },
      planB: {
        pay: payB,
        discount: discB,
        rate: Math.round(effectiveRateB * 10) / 10,
        storeLoss: discB,
      },
      planC: {
        pay: price,
        pointGiven: pointAmount,
        customerNet: customerNetPrice,
        rate: Math.round(effectiveRateC * 10) / 10,
        storeLoss: storePointCost,
      },
    };
  }, [comparePrice, compareRate, compareCoupon, comparePointMultiplier]);

  // ====================================================
  // タブ3: まとめ買い計算ロジック
  // ====================================================
  const bundleCalc = useMemo(() => {
    const unitPrice = parseFloat(bundleUnitPrice) || 0;
    const qty = parseInt(bundleQty, 10) || 1;
    if (unitPrice <= 0 || qty <= 0) return { isValid: false };

    const regularTotal = unitPrice * qty;
    let finalTotal = regularTotal;

    if (bundleType === "percent") {
      const r = parseFloat(bundleDiscountRate) || 0;
      const d = Math.round(regularTotal * (r / 100));
      finalTotal = Math.max(0, regularTotal - d);
    } else if (bundleType === "second_discount") {
      const r = parseFloat(secondItemRate) || 0;
      if (qty >= 2) {
        const discountedQty = qty - 1;
        const discountPerItem = Math.round(unitPrice * (r / 100));
        const totalDiscount = discountPerItem * discountedQty;
        finalTotal = Math.max(0, regularTotal - totalDiscount);
      } else {
        finalTotal = unitPrice;
      }
    } else {
      const fixed = parseFloat(fixedSetPrice) || 0;
      finalTotal = fixed;
    }

    const totalDiscount = Math.max(0, regularTotal - finalTotal);
    const effectiveUnitPrice = Math.round(finalTotal / qty);
    const effectiveRate = regularTotal > 0 ? (totalDiscount / regularTotal) * 100 : 0;

    return {
      isValid: true,
      regularTotal,
      finalTotal,
      totalDiscount,
      effectiveUnitPrice,
      effectiveRate: Math.round(effectiveRate * 10) / 10,
    };
  }, [bundleUnitPrice, bundleQty, bundleType, bundleDiscountRate, secondItemRate, fixedSetPrice]);

  // ----------------------------------------------------
  // コピー処理
  // ----------------------------------------------------
  const handleCopyBasic = () => {
    if (!basicCalc.isValid) return;
    const text = `【セール特価】通常価格 ¥${Number(regularPrice).toLocaleString()}（${taxMode === "included" ? "税込" : "税抜"}） ➔ ¥${basicCalc.salePrice.toLocaleString()}（${taxMode === "included" ? "税込" : "税抜"}） 【${basicCalc.actualRate}%OFF / ¥${basicCalc.discountAmount.toLocaleString()}引き】
EC Tool Crate | 割引計算ツール
https://ec-tool-crate.com/discount-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBasic(true);
      toast({
        title: "セール告知テキストをコピーしました",
        description: "商品ページやメルマガ・SNS投稿にそのまま貼り付けられます。",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedBasic(false), 2000);
    });
  };

  const handleCopyBundle = () => {
    if (!bundleCalc.isValid) return;
    const text = `【まとめ買い特価】${bundleQty}点セット 通常 ¥${bundleCalc.regularTotal.toLocaleString()} ➔ 特別価格 ¥${bundleCalc.finalTotal.toLocaleString()}（1点あたり実質 ¥${bundleCalc.effectiveUnitPrice.toLocaleString()} / ${bundleCalc.effectiveRate}%OFF・¥${bundleCalc.totalDiscount.toLocaleString()}引き）
EC Tool Crate | 割引計算ツール
https://ec-tool-crate.com/discount-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBundle(true);
      toast({
        title: "まとめ買い告知テキストをコピーしました",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedBundle(false), 2000);
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
            <span>① セール売価 & 割引率の即時計算</span>
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
            <FiAward />
            <span>② 施策比較（%引き vs クーポン vs ポイント）</span>
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
            <span>③ まとめ買い・バンドル割引計算</span>
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
                <MainContentsHeading heading="割引条件の入力" />
                <Badge colorScheme="green" variant="subtle" px={2.5} py={1} borderRadius="md" fontSize="xs">
                  即時自動計算
                </Badge>
              </Flex>

              {/* 税区分選択 */}
              <Box p={3.5} bg="#f8f9fa" borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                    入力金額の税区分
                  </Text>
                  <Badge colorScheme="blue" variant="subtle" fontSize="11px">
                    {taxMode === "included" ? "税込入力（総額表示）" : "税抜入力（消費税10%自動換算）"}
                  </Badge>
                </Flex>
                <RadioGroup onChange={setTaxMode} value={taxMode} colorScheme="green">
                  <HStack gap={5}>
                    <Radio value="included" size="sm">
                      <Text fontSize="sm">税込（総額）</Text>
                    </Radio>
                    <Radio value="excluded" size="sm">
                      <Text fontSize="sm">税抜</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              {/* 通常価格入力 */}
              <NumberInputForm
                id="regular-price"
                label={`通常価格（定価・${taxMode === "included" ? "税込" : "税抜"}・円）`}
                value={regularPrice}
                min={0}
                step={100}
                onChange={(val) => setRegularPrice(parseFloat(val) || 0)}
                errorMessage="通常価格を入力してください"
                isInvalid={regularPrice <= 0}
              />

              {/* 計算方式の切り替え */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700" mb={2}>
                  割引の指定方法
                </Text>
                <RadioGroup onChange={setCalcMode} value={calcMode} colorScheme="green">
                  <HStack gap={{ base: 3, md: 5 }} flexWrap="wrap">
                    <Radio value="rate" size="sm">
                      <Text fontSize="sm">割引率（◯%OFF）</Text>
                    </Radio>
                    <Radio value="amount" size="sm">
                      <Text fontSize="sm">値引き額（◯円引）</Text>
                    </Radio>
                    <Radio value="salePrice" size="sm">
                      <Text fontSize="sm">セール価格から逆算</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              {/* 各モードに応じた入力欄 */}
              {calcMode === "rate" && (
                <Box>
                  <Flex justify="space-between" align="center" mb={1.5}>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                      割引率（%OFF / 割引割合）
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      ※ 20% ＝ 2割引
                    </Text>
                  </Flex>
                  <NumberInputForm
                    id="discount-rate"
                    value={discountRate}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    onChange={(val) => setDiscountRate(parseFloat(val) || 0)}
                  />
                  {/* クイックプリセット */}
                  <Flex gap={2} mt={2.5} flexWrap="wrap">
                    {[5, 10, 15, 20, 30, 50].map((r) => (
                      <Button
                        key={r}
                        size="sm"
                        variant={discountRate === r ? "solid" : "outline"}
                        colorScheme={discountRate === r ? "green" : "gray"}
                        onClick={() => setDiscountRate(r)}
                        fontSize={{ base: "xs", md: "sm" }}
                        borderRadius="full"
                      >
                        {r}% OFF
                      </Button>
                    ))}
                  </Flex>
                </Box>
              )}

              {calcMode === "amount" && (
                <Box>
                  <NumberInputForm
                    id="discount-amount"
                    label="値引き金額（円）"
                    value={discountAmountInput}
                    min={0}
                    step={100}
                    unit="円引"
                    onChange={(val) => setDiscountAmountInput(parseFloat(val) || 0)}
                  />
                </Box>
              )}

              {calcMode === "salePrice" && (
                <Box>
                  <NumberInputForm
                    id="target-sale-price"
                    label={`セール販売価格（${taxMode === "included" ? "税込" : "税抜"}・円）`}
                    value={targetSalePrice}
                    min={0}
                    step={100}
                    onChange={(val) => setTargetSalePrice(parseFloat(val) || 0)}
                  />
                </Box>
              )}
            </Stack>

            {/* 計算結果エリア */}
            <Stack gap={6}>
              <Box
                p={{ base: 5, md: 7 }}
                bg="#f0fdf4"
                border="2px solid"
                borderColor="green.400"
                borderRadius="xl"
                shadow="sm"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <MainContentsHeading heading="セール価格の計算結果" />
                  <Badge colorScheme="green" fontSize="12px" px={2.5} py={1}>
                    {taxMode === "included" ? "税込総額表示" : "税抜表示"}
                  </Badge>
                </Flex>

                {/* メイン結果：セール価格 */}
                <Box mb={5} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                    セール販売価格（値引き後売価）
                  </Text>
                  <Flex align="baseline" gap={2} my={1}>
                    <Text
                      fontSize={{ base: "32px", md: "40px" }}
                      fontWeight="bold"
                      color="green.700"
                      className="font-mono leading-none"
                    >
                      {basicCalc.isValid ? basicCalc.salePrice.toLocaleString() : "0"}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      円
                    </Text>
                  </Flex>

                  {/* 税込・税抜のサブ表示 */}
                  <HStack gap={4} mt={2} pt={2} borderTop="1px dashed" borderColor="gray.200" fontSize="xs" color="gray.500">
                    <Text>
                      {taxMode === "included"
                        ? `（税抜: 約 ${basicCalc.salePriceNoTax.toLocaleString()} 円）`
                        : `（税込: 約 ${basicCalc.salePriceWithTax.toLocaleString()} 円）`}
                    </Text>
                  </HStack>
                </Box>

                {/* サブ結果グリッド（値引き額 & 実質割引率） */}
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={5}>
                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                      お得な値引き金額（割引額）
                    </Text>
                    <Flex align="baseline" gap={1.5} my={1}>
                      <Text
                        fontSize={{ base: "22px", md: "26px" }}
                        fontWeight="bold"
                        color="red.600"
                        className="font-mono"
                      >
                        {basicCalc.isValid ? `-${basicCalc.discountAmount.toLocaleString()}` : "0"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        円
                      </Text>
                    </Flex>
                  </Box>

                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                      実質割引率（OFF割合）
                    </Text>
                    <Flex align="baseline" gap={1.5} my={1}>
                      <Text
                        fontSize={{ base: "22px", md: "26px" }}
                        fontWeight="bold"
                        color="blue.700"
                        className="font-mono"
                      >
                        {basicCalc.isValid ? `${basicCalc.actualRate}%` : "0%"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        OFF
                      </Text>
                    </Flex>
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
                  {copiedBasic ? "セール表記テキストをコピーしました！" : "セール告知テキストを1クリックコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* 割引率別早見表テーブル */}
          <Box mt={10} p={{ base: 5, md: 7 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" shadow="sm">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" fontSize={{ base: "17px", md: "20px" }} color="gray.900" className="flex items-center gap-2">
                  <FiTrendingDown className="text-emerald-600" />
                  <span>【割引早見表】通常価格 ¥{Number(regularPrice).toLocaleString()} に対する割引率別一覧</span>
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
                  イベント申請や商品ページのセール価格一括設定時に便利な売価一覧表です。
                </Text>
              </Box>
            </Flex>

            <TableContainer border="1px solid" borderColor="gray.200" borderRadius="xl">
              <Table variant="simple" size="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.800" py={3.5} fontSize="13px">割引率 (%OFF)</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">セール販売価格</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">値引き金額（割引額）</Th>
                    <Th color="gray.800" py={3.5} fontSize="13px">割引名称（割表記）</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {basicCalc.quickRates.map((row) => (
                    <Tr
                      key={row.rate}
                      bg={row.rate === basicCalc.actualRate ? "#f0fdf4" : "transparent"}
                      _hover={{ bg: "#fafaf9" }}
                    >
                      <Td fontWeight="bold" color={row.rate === basicCalc.actualRate ? "green.700" : "gray.800"}>
                        {row.rate}% OFF
                        {row.rate === basicCalc.actualRate && (
                          <Badge ml={2} colorScheme="green" fontSize="10px">
                            選択中
                          </Badge>
                        )}
                      </Td>
                      <Td fontFamily="mono" fontWeight="bold" fontSize="15px" color="gray.900">
                        {row.salePrice.toLocaleString()} 円
                      </Td>
                      <Td fontFamily="mono" fontSize="14px" color="red.600">
                        -{row.discountAmount.toLocaleString()} 円
                      </Td>
                      <Td fontSize="13px" color="gray.600">
                        {row.rate % 10 === 0 ? `${row.rate / 10}割引` : `${row.rate / 10}割引き`}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ2: 施策比較パネル (%OFF vs クーポン vs ポイント) */}
        {/* ==================================================== */}
        <TabPanel p={0}>
          <Stack gap={8}>
            <Box p={{ base: 5, md: 7 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" shadow="sm">
              <MainContentsHeading heading="施策比較の条件設定" />
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={5}>
                同じ商品に対して「%値引き」「定額クーポン」「ショップ負担ポイント還元」を実施した場合の、顧客の見え方と店舗の実質負担を横並びで比較します。
              </Text>

              <Grid
                gap={5}
                alignItems="start"
                css={css`
                  @container parent (min-width: 600px) {
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                  }
                  grid-template-columns: 1fr;
                `}
              >
                <NumberInputForm
                  id="compare-price"
                  label="通常価格（円）"
                  value={comparePrice}
                  min={0}
                  step={500}
                  onChange={(val) => setComparePrice(parseFloat(val) || 0)}
                />
                <NumberInputForm
                  id="compare-rate"
                  label="施策A: %OFF率"
                  value={compareRate}
                  min={1}
                  max={99}
                  step={5}
                  unit="%"
                  onChange={(val) => setCompareRate(parseFloat(val) || 0)}
                />
                <NumberInputForm
                  id="compare-coupon"
                  label="施策B: 定額クーポン"
                  value={compareCoupon}
                  min={0}
                  step={100}
                  unit="円引"
                  onChange={(val) => setCompareCoupon(parseFloat(val) || 0)}
                />
                <NumberInputForm
                  id="compare-points"
                  label="施策C: ポイント倍率"
                  value={comparePointMultiplier}
                  min={1}
                  max={50}
                  step={1}
                  unit="倍"
                  onChange={(val) => setComparePointMultiplier(parseFloat(val) || 1)}
                />
              </Grid>
            </Box>

            {/* 3施策の横並びカード */}
            {comparisonCalc.isValid && (
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                {/* 施策A: %OFF */}
                <Card border="1.5px solid" borderColor="teal.300" borderRadius="xl" shadow="sm">
                  <CardBody p={5}>
                    <Badge colorScheme="teal" fontSize="12px" px={2.5} py={1} mb={3}>
                      施策A: 【{compareRate}%OFF】
                    </Badge>
                    <Heading as="h4" fontSize="16px" color="gray.800" mb={3}>
                      ダイレクト割引
                    </Heading>

                    <Stack gap={2.5} fontSize="sm">
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">お客様の支払額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.900" fontSize="16px">
                          ¥{comparisonCalc.planA.pay.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">値引き額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="red.600">
                          -¥{comparisonCalc.planA.discount.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">実質値引き率</Text>
                        <Text fontWeight="bold" color="teal.700">
                          {comparisonCalc.planA.rate}% OFF
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1}>
                        <Text color="gray.500">店舗の売上減少額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.800">
                          ¥{comparisonCalc.planA.storeLoss.toLocaleString()}
                        </Text>
                      </Flex>
                    </Stack>

                    <Box mt={4} p={3} bg="teal.50" borderRadius="md" fontSize="xs" color="teal.900">
                      💡 <strong>特徴</strong>: 低〜中価格帯の商品で「割引感」がダイレクトに伝わりやすく、即時成約率（CVR）を高めるのに最も効果的です。
                    </Box>
                  </CardBody>
                </Card>

                {/* 施策B: 定額クーポン */}
                <Card border="1.5px solid" borderColor="purple.300" borderRadius="xl" shadow="sm">
                  <CardBody p={5}>
                    <Badge colorScheme="purple" fontSize="12px" px={2.5} py={1} mb={3}>
                      施策B: 【¥{Number(compareCoupon).toLocaleString()} OFFクーポン】
                    </Badge>
                    <Heading as="h4" fontSize="16px" color="gray.800" mb={3}>
                      定額値引きクーポン
                    </Heading>

                    <Stack gap={2.5} fontSize="sm">
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">お客様の支払額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.900" fontSize="16px">
                          ¥{comparisonCalc.planB.pay.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">値引き額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="red.600">
                          -¥{comparisonCalc.planB.discount.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">実質値引き率</Text>
                        <Text fontWeight="bold" color="purple.700">
                          {comparisonCalc.planB.rate}% OFF
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1}>
                        <Text color="gray.500">店舗のクーポン負担</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.800">
                          ¥{comparisonCalc.planB.storeLoss.toLocaleString()}
                        </Text>
                      </Flex>
                    </Stack>

                    <Box mt={4} p={3} bg="purple.50" borderRadius="md" fontSize="xs" color="purple.900">
                      💡 <strong>特徴</strong>: 「◯千円以上で使える」と利用下限を設定しやすいため、客単価アップやついで買い促進に強い施策です。
                    </Box>
                  </CardBody>
                </Card>

                {/* 施策C: ポイント倍率 */}
                <Card border="1.5px solid" borderColor="orange.300" borderRadius="xl" shadow="sm">
                  <CardBody p={5}>
                    <Badge colorScheme="orange" fontSize="12px" px={2.5} py={1} mb={3}>
                      施策C: 【ポイント {comparePointMultiplier}倍（ショップ負担）】
                    </Badge>
                    <Heading as="h4" fontSize="16px" color="gray.800" mb={3}>
                      ポイント還元
                    </Heading>

                    <Stack gap={2.5} fontSize="sm">
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">お客様の支払額</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.900" fontSize="16px">
                          ¥{comparisonCalc.planC.pay.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">付与ポイント数</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="orange.600">
                          +{comparisonCalc.planC.pointGiven.toLocaleString()} pt
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                        <Text color="gray.500">実質負担率</Text>
                        <Text fontWeight="bold" color="orange.700">
                          実質 {comparisonCalc.planC.rate}% 相当
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py={1}>
                        <Text color="gray.500">店舗の追加負担</Text>
                        <Text fontWeight="bold" fontFamily="mono" color="gray.800">
                          ¥{comparisonCalc.planC.storeLoss.toLocaleString()}
                        </Text>
                      </Flex>
                    </Stack>

                    <Box mt={4} p={3} bg="orange.50" borderRadius="md" fontSize="xs" color="orange.900">
                      💡 <strong>特徴</strong>: 決済時の現金売上を維持しつつ、次回のお買い物で使えるポイントを付与するため、リピート購入促進に直結します。
                    </Box>
                  </CardBody>
                </Card>
              </SimpleGrid>
            )}
          </Stack>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ3: まとめ買い・バンドル割引パネル */}
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
              <MainContentsHeading heading="まとめ買い条件の入力" />

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
                  id="bundle-unit-price"
                  label="1個あたりの通常価格（円）"
                  value={bundleUnitPrice}
                  min={0}
                  step={100}
                  onChange={(val) => setBundleUnitPrice(parseFloat(val) || 0)}
                />
                <NumberInputForm
                  id="bundle-qty"
                  label="まとめ買い点数（個数）"
                  value={bundleQty}
                  min={2}
                  max={100}
                  step={1}
                  unit="個"
                  onChange={(val) => setBundleQty(parseInt(val, 10) || 1)}
                />
              </Grid>

              {/* 割引タイプの選択 */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700" mb={2.5}>
                  バンドル（セット）割引のパターン
                </Text>
                <RadioGroup onChange={setBundleType} value={bundleType} colorScheme="green">
                  <Stack gap={2}>
                    <Radio value="percent" size="sm">
                      <Text fontSize="sm">① セット全体から◯%OFF（例: 3点買うと15%OFF）</Text>
                    </Radio>
                    <Radio value="second_discount" size="sm">
                      <Text fontSize="sm">② 2点目以降を◯%OFF（例: 2点目半額キャンペーン）</Text>
                    </Radio>
                    <Radio value="fixed_set" size="sm">
                      <Text fontSize="sm">③ よりどり固定価格（例: 3点よりどりで5,000円）</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              {/* タイプ別入力 */}
              {bundleType === "percent" && (
                <NumberInputForm
                  id="bundle-rate"
                  label="一括割引率（%）"
                  value={bundleDiscountRate}
                  min={1}
                  max={99}
                  step={5}
                  unit="%"
                  onChange={(val) => setBundleDiscountRate(parseFloat(val) || 0)}
                />
              )}

              {bundleType === "second_discount" && (
                <NumberInputForm
                  id="second-item-rate"
                  label="2点目以降の割引率（%）"
                  value={secondItemRate}
                  min={1}
                  max={99}
                  step={5}
                  unit="%OFF"
                  onChange={(val) => setSecondItemRate(parseFloat(val) || 0)}
                />
              )}

              {bundleType === "fixed_set" && (
                <NumberInputForm
                  id="fixed-set-price"
                  label="セット全体の特別価格（円）"
                  value={fixedSetPrice}
                  min={0}
                  step={500}
                  onChange={(val) => setFixedSetPrice(parseFloat(val) || 0)}
                />
              )}
            </Stack>

            {/* 結果エリア */}
            <Stack gap={6}>
              <Box
                p={{ base: 5, md: 7 }}
                bg="#f0fdf4"
                border="2px solid"
                borderColor="green.400"
                borderRadius="xl"
                shadow="sm"
              >
                <MainContentsHeading heading="まとめ買い試算結果" />

                {/* メイン結果：セット総額 */}
                <Box my={4} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                    まとめ買いセット販売価格（{bundleQty}個合計）
                  </Text>
                  <Flex align="baseline" gap={2} my={1}>
                    <Text
                      fontSize={{ base: "32px", md: "38px" }}
                      fontWeight="bold"
                      color="green.700"
                      className="font-mono leading-none"
                    >
                      {bundleCalc.isValid ? bundleCalc.finalTotal.toLocaleString() : "0"}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      円
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    通常合計 ¥{bundleCalc.regularTotal.toLocaleString()} から{" "}
                    <strong className="text-red-600">¥{bundleCalc.totalDiscount.toLocaleString()} 引き</strong>
                  </Text>
                </Box>

                {/* サブ結果グリッド */}
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={5}>
                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                      1個あたり実質単価
                    </Text>
                    <Flex align="baseline" gap={1.5} my={1}>
                      <Text
                        fontSize={{ base: "20px", md: "24px" }}
                        fontWeight="bold"
                        color="blue.700"
                        className="font-mono"
                      >
                        {bundleCalc.isValid ? bundleCalc.effectiveUnitPrice.toLocaleString() : "0"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        円/個
                      </Text>
                    </Flex>
                    <Text fontSize="11px" color="gray.500">
                      定価 ¥{Number(bundleUnitPrice).toLocaleString()} から実質値下げ
                    </Text>
                  </Box>

                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                      全体の実質割引率
                    </Text>
                    <Flex align="baseline" gap={1.5} my={1}>
                      <Text
                        fontSize={{ base: "20px", md: "24px" }}
                        fontWeight="bold"
                        color="teal.700"
                        className="font-mono"
                      >
                        {bundleCalc.isValid ? `${bundleCalc.effectiveRate}%` : "0%"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        OFF
                      </Text>
                    </Flex>
                    <Text fontSize="11px" color="gray.500">
                      セット全体の割引インパクト
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* コピーボタン */}
                <Button
                  leftIcon={copiedBundle ? <FiCheck /> : <FiCopy />}
                  colorScheme={copiedBundle ? "green" : "teal"}
                  size="lg"
                  width="100%"
                  onClick={handleCopyBundle}
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  py={6}
                >
                  {copiedBundle ? "まとめ買い表記をコピーしました！" : "まとめ買い告知テキストをコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DiscountCalculatorFeature;