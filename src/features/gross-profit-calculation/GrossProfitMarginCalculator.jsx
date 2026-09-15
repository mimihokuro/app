import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Badge,
  Divider,
  useToast,
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import {
  FiCopy,
  FiRefreshCw,
  FiCheck,
  FiHelpCircle,
} from "react-icons/fi";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

const GrossProfitMarginCalculator = () => {
  const [sellingPrice, setSellingPrice] = useState(3000);
  const [cost, setCost] = useState(1000);
  const [taxType, setTaxType] = useState("included"); // 'included' | 'excluded'
  const [feeRate, setFeeRate] = useState(10); // 手数料率 (%)
  const [shippingAndPacking, setShippingAndPacking] = useState(500); // 配送料・梱包資材費 (円)
  const [copied, setCopied] = useState(false);

  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  // 計算ロジック
  const calculation = useMemo(() => {
    const rawPrice = parseFloat(sellingPrice) || 0;
    const rawCost = parseFloat(cost) || 0;
    const fRate = parseFloat(feeRate) || 0;
    const s = parseFloat(shippingAndPacking) || 0;

    if (rawPrice <= 0) {
      return {
        isValid: false,
        taxIncludedPrice: 0,
        taxExcludedPrice: 0,
        taxIncludedCost: 0,
        taxExcludedCost: 0,
        grossProfit: 0,
        grossProfitRate: 0,
        feeAmount: 0,
        netProfit: 0,
        netProfitRate: 0,
        taxAmount: 0,
        costRatio: 0,
        feeRatio: 0,
        shippingRatio: 0,
        netProfitRatioPercent: 0,
      };
    }

    // 税区分に応じた税込・税抜の実効価格
    let taxIncludedPrice = 0;
    let taxExcludedPrice = 0;
    let taxIncludedCost = 0;
    let taxExcludedCost = 0;

    if (taxType === "included") {
      taxIncludedPrice = rawPrice;
      taxExcludedPrice = Math.floor(rawPrice / 1.1);
      taxIncludedCost = rawCost;
      taxExcludedCost = Math.floor(rawCost / 1.1);
    } else {
      taxExcludedPrice = rawPrice;
      taxIncludedPrice = Math.floor(rawPrice * 1.1);
      taxExcludedCost = rawCost;
      taxIncludedCost = Math.floor(rawCost * 1.1);
    }

    // ECモール手数料額の算出（モール手数料は通常「税込売上」に対して課金される）
    const feeAmount = Math.floor(taxIncludedPrice * (fRate / 100));

    // 粗利益額（売上 - 原価）
    const grossProfit = taxIncludedPrice - taxIncludedCost;
    const grossProfitRate = (grossProfit / taxIncludedPrice) * 100;

    // 実質手残り額（税込売上 - 税込原価 - 手数料額 - 送料資材費）
    const netProfit = taxIncludedPrice - taxIncludedCost - feeAmount - s;
    const netProfitRate = (netProfit / taxIncludedPrice) * 100;

    // 消費税額（売上にかかる税額）
    const taxAmount = taxIncludedPrice - taxExcludedPrice;

    // 構成比（グラフ表示用）
    const costRatio = Math.max(0, Math.min(100, (taxIncludedCost / taxIncludedPrice) * 100));
    const feeRatio = Math.max(0, Math.min(100, (feeAmount / taxIncludedPrice) * 100));
    const shippingRatio = Math.max(0, Math.min(100, (s / taxIncludedPrice) * 100));
    const netProfitRatioPercent = Math.max(
      0,
      Math.min(100, (netProfit / taxIncludedPrice) * 100)
    );

    return {
      isValid: true,
      taxIncludedPrice,
      taxExcludedPrice,
      taxIncludedCost,
      taxExcludedCost,
      grossProfit,
      grossProfitRate: Math.round(grossProfitRate * 10) / 10,
      feeAmount,
      netProfit,
      netProfitRate: Math.round(netProfitRate * 10) / 10,
      taxAmount,
      costRatio,
      feeRatio,
      shippingRatio,
      netProfitRatioPercent,
    };
  }, [sellingPrice, cost, taxType, feeRate, shippingAndPacking]);

  // 手数料プリセット
  const feePresets = [
    { label: "0%", value: 0 },
    { label: "Yahoo! (7%)", value: 7.0 },
    { label: "楽天/Amazon (10%)", value: 10.0 },
    { label: "モール高料率 (15%)", value: 15.0 },
  ];

  // リセット
  const handleReset = () => {
    setSellingPrice(0);
    setCost(0);
    setTaxType("included");
    setFeeRate(0);
    setShippingAndPacking(0);
    toast({
      title: "数値をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  // ワンクリック結果コピー
  const handleCopyResult = () => {
    if (!calculation.isValid) {
      toast({
        title: "販売価格を入力してください",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }

    const isTaxInc = taxType === "included";
    const textToCopy = `【粗利計算結果】
■ 販売価格：${calculation.taxIncludedPrice.toLocaleString()}円（税込）${!isTaxInc ? ` [入力税抜: ${Number(sellingPrice).toLocaleString()}円]` : ""}
■ 仕入原価：${calculation.taxIncludedCost.toLocaleString()}円（税込）${!isTaxInc ? ` [入力税抜: ${Number(cost).toLocaleString()}円]` : ""}
■ 手数料率：${feeRate}%（手数料額：${calculation.feeAmount.toLocaleString()}円）
■ 配送料・梱包資材費：${Number(shippingAndPacking).toLocaleString()}円
━━━━━━━━━━━━━━━━━━━━
■ 粗利益額（売上総利益）：${calculation.grossProfit.toLocaleString()}円（粗利率：${calculation.grossProfitRate}%）
★ 実質手残り額（限界利益）：${calculation.netProfit.toLocaleString()}円（手残り率：${calculation.netProfitRate}%）
━━━━━━━━━━━━━━━━━━━━
EC Tool Crate | 粗利計算ツール
https://ec-tool-crate.com/gross-profit-calculator`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast({
        title: "計算結果をクリップボードにコピーしました",
        description: "チャットやスプレッドシートに貼り付けて活用できます。",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
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
      {/* 入力フォームエリア */}
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

        {/* 税区分切り替えトグル */}
        <Box
          p={4}
          bg="#f8f9fa"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between" align="center" mb={2.5}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="gray.800">
              入力金額の税区分
            </Text>
            <Badge colorScheme={taxType === "included" ? "blue" : "purple"} variant="subtle" fontSize="11px" px={2} py={0.5}>
              {taxType === "included"
                ? "入力値を税込として計算"
                : "税抜入力＋税率10%で自動整合"}
            </Badge>
          </Flex>
          <RadioGroup
            onChange={setTaxType}
            value={taxType}
            colorScheme="green"
          >
            <HStack gap={5}>
              <Radio value="included" size="md">
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                  税込（総額表示）
                </Text>
              </Radio>
              <Radio value="excluded" size="md">
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                  税抜（税率10%加算）
                </Text>
              </Radio>
            </HStack>
          </RadioGroup>
          {taxType === "excluded" && calculation.isValid && (
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mt={2.5} bg="white" p={2} borderRadius="md" border="1px solid" borderColor="gray.200" lineHeight="relaxed">
              💡 税込換算：販売価格 <strong>{calculation.taxIncludedPrice.toLocaleString()}円</strong> / 仕入原価 <strong>{calculation.taxIncludedCost.toLocaleString()}円</strong> として計算します。
            </Text>
          )}
        </Box>

        {/* 必須入力 */}
        <Grid
          gap={5}
          css={css`
            @container parent (min-width: 480px) {
              grid-template-columns: 1fr 1fr;
            }
            grid-template-columns: 1fr;
          `}
        >
          <NumberInputForm
            id="selling-price"
            label={`販売価格（${taxType === "included" ? "税込" : "税抜"}・円）`}
            value={sellingPrice}
            min={0}
            step={100}
            onChange={(val) => setSellingPrice(parseFloat(val) || 0)}
            errorMessage="販売価格を入力してください"
            isInvalid={sellingPrice <= 0}
          />
          <NumberInputForm
            id="cost-price"
            label={`仕入原価（${taxType === "included" ? "税込" : "税抜"}・円）`}
            value={cost}
            min={0}
            step={100}
            onChange={(val) => setCost(parseFloat(val) || 0)}
            errorMessage="原価を入力してください"
            isInvalid={cost < 0}
          />
        </Grid>

        {/* 手数料率とプリセット */}
        <Box>
          <Flex justify="space-between" align="center" mb={1.5}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
              販売手数料・決済手数料率（%）
            </Text>
            <Tooltip
              label="モール成約手数料（Amazon約10%, 楽天約8〜12%）や決済手数料（3〜4%）の合算値を入力。通常、税込売上に対して課金されます。"
              placement="top"
              hasArrow
            >
              <span>
                <FiHelpCircle className="text-gray-400 hover:text-gray-600 cursor-pointer text-base" />
              </span>
            </Tooltip>
          </Flex>
          <NumberInputForm
            id="fee-rate"
            value={feeRate}
            min={0}
            max={100}
            step={0.5}
            precision={1}
            unit="%"
            onChange={(val) => setFeeRate(parseFloat(val) || 0)}
          />
          {/* 手数料プリセットボタン */}
          <Flex gap={2} mt={2.5} flexWrap="wrap">
            {feePresets.map((preset) => (
              <Button
                key={preset.label}
                size="sm"
                variant={feeRate === preset.value ? "solid" : "outline"}
                colorScheme={feeRate === preset.value ? "green" : "gray"}
                onClick={() => setFeeRate(preset.value)}
                fontSize={{ base: "xs", md: "sm" }}
                borderRadius="full"
                px={3}
              >
                {preset.label}
              </Button>
            ))}
          </Flex>
        </Box>

        {/* 配送料・梱包資材費 */}
        <Box>
          <Flex justify="space-between" align="center" mb={1.5}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
              配送料・梱包資材費（円）
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
              ※ 送料無料設定時の出荷コスト
            </Text>
          </Flex>
          <NumberInputForm
            id="shipping-and-packing"
            value={shippingAndPacking}
            min={0}
            step={50}
            unit="円"
            onChange={(val) => setShippingAndPacking(parseFloat(val) || 0)}
          />
        </Box>

        {/* アクションボタン */}
        <ButtonGroup width="100%" gap={3} pt={2}>
          <Button
            leftIcon={<FiRefreshCw />}
            variant="outline"
            colorScheme="gray"
            size="lg"
            width="100%"
            onClick={handleReset}
            borderRadius="lg"
            fontWeight="medium"
            fontSize={{ base: "sm", md: "md" }}
          >
            条件をリセット
          </Button>
        </ButtonGroup>
      </Stack>

      {/* 計算結果表示エリア */}
      <Stack
        gap={6}
        p={{ base: 5, md: 7 }}
        border="1px solid"
        borderColor={calculation.grossProfit < 0 ? "red.300" : "green.400"}
        borderRadius="xl"
        bg={calculation.grossProfit < 0 ? "#fffaf9" : "#fbfdfc"}
        shadow="sm"
        position="sticky"
        top="20px"
      >
        <Flex justify="space-between" align="center">
          <MainContentsHeading heading="計算結果" />
          <Badge
            colorScheme={
              !calculation.isValid
                ? "gray"
                : calculation.grossProfit < 0
                ? "red"
                : calculation.grossProfitRate >= 50
                ? "green"
                : "orange"
            }
            fontSize={{ base: "xs", md: "sm" }}
            px={3}
            py={1}
            borderRadius="full"
          >
            {!calculation.isValid
              ? "数値未入力"
              : calculation.grossProfit < 0
              ? "原価割れ・赤字"
              : calculation.grossProfitRate >= 50
              ? "高粗利"
              : "標準粗利"}
          </Badge>
        </Flex>

        {/* メイン結果：粗利益額（売上総利益）と粗利益率 */}
        <Box
          p={{ base: 5, md: 6 }}
          bg={calculation.grossProfit < 0 ? "red.50" : "green.50"}
          border="1.5px solid"
          borderColor={calculation.grossProfit < 0 ? "red.300" : "green.400"}
          borderRadius="xl"
          shadow="xs"
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              color={calculation.grossProfit < 0 ? "red.800" : "green.900"}
              className="tracking-wider uppercase"
            >
              💰 粗利益額（売上総利益）
            </Text>
            <Badge
              colorScheme={calculation.grossProfit < 0 ? "red" : "green"}
              variant="solid"
              borderRadius="md"
              fontSize={{ base: "sm", md: "md" }}
              px={3}
              py={1}
            >
              粗利率 {calculation.isValid ? `${calculation.grossProfitRate}%` : "0%"}
            </Badge>
          </Flex>

          <Flex align="baseline" gap={2} my={3}>
            <Text
              fontSize={{ base: "42px", md: "52px" }}
              fontWeight="800"
              lineHeight="1"
              color={calculation.grossProfit < 0 ? "red.600" : "green.700"}
              className="font-mono tracking-tight"
            >
              {calculation.isValid ? calculation.grossProfit.toLocaleString() : "0"}
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.700">
              円
            </Text>
          </Flex>

          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mt={1}>
            販売価格（税込 {calculation.isValid ? calculation.taxIncludedPrice.toLocaleString() : "0"}円） － 仕入原価（税込 {calculation.isValid ? calculation.taxIncludedCost.toLocaleString() : "0"}円）
          </Text>
        </Box>

        {/* サブ結果：実質手残り額（限界利益） */}
        <Box
          p={{ base: 4, md: 5 }}
          bg={calculation.netProfit < 0 ? "red.50" : "white"}
          border="1px solid"
          borderColor={calculation.netProfit < 0 ? "red.200" : "gray.200"}
          borderRadius="lg"
        >
          <Flex justify="space-between" align="center" mb={1.5}>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" fontWeight="bold">
              ★ 実質手残り額（限界利益）
            </Text>
            <Badge
              colorScheme={
                !calculation.isValid
                  ? "gray"
                  : calculation.netProfit < 0
                  ? "red"
                  : calculation.netProfitRate >= 30
                  ? "green"
                  : "orange"
              }
              variant="subtle"
              borderRadius="md"
              fontSize={{ base: "xs", md: "sm" }}
              px={2.5}
              py={0.5}
            >
              手残り率 {calculation.isValid ? `${calculation.netProfitRate}%` : "0%"}
            </Badge>
          </Flex>

          <Flex align="baseline" gap={2} my={1.5}>
            <Text
              fontSize={{ base: "28px", md: "34px" }}
              fontWeight="bold"
              color={calculation.netProfit < 0 ? "red.600" : "gray.800"}
              className="font-mono"
            >
              {calculation.isValid ? calculation.netProfit.toLocaleString() : "0"}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" fontWeight="bold">
              円
            </Text>
          </Flex>

          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" lineHeight="relaxed">
            ※ 粗利から【販売手数料（{calculation.isValid ? calculation.feeAmount.toLocaleString() : "0"}円）＋送料・資材費（{Number(shippingAndPacking).toLocaleString()}円）】を引いた純手元現金
          </Text>
        </Box>

        {/* コスト構成の内訳 */}
        <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="gray.800" mb={3}>
            1点あたりのコスト・利益の内訳（税込換算）
          </Text>

          {/* ビジュアルプログレスバー */}
          {calculation.isValid && calculation.netProfit > 0 && (
            <Box mb={4}>
              <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-100 text-[10px] font-bold text-white">
                <div
                  style={{ width: `${calculation.costRatio}%` }}
                  className="bg-gray-400 flex items-center justify-center overflow-hidden"
                  title={`仕入原価: ${calculation.costRatio.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${calculation.feeRatio}%` }}
                  className="bg-amber-500 flex items-center justify-center overflow-hidden"
                  title={`販売手数料: ${calculation.feeRatio.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${calculation.shippingRatio}%` }}
                  className="bg-blue-400 flex items-center justify-center overflow-hidden"
                  title={`送料資材費: ${calculation.shippingRatio.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${calculation.netProfitRatioPercent}%` }}
                  className="bg-emerald-600 flex items-center justify-center overflow-hidden"
                  title={`実質手残り: ${calculation.netProfitRatioPercent.toFixed(1)}%`}
                />
              </div>
              <Flex justify="space-between" fontSize={{ base: "xs", md: "sm" }} color="gray.600" mt={2}>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block"></span> 原価
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 手数料
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span> 送料資材
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> 手残り
                </span>
              </Flex>
            </Box>
          )}

          <Stack gap={2.5} fontSize={{ base: "xs", md: "sm" }}>
            <Flex justify="space-between" color="gray.700">
              <span>仕入原価（税込）：</span>
              <span className="font-mono font-medium">
                {calculation.isValid ? calculation.taxIncludedCost.toLocaleString() : "0"} 円
                {taxType === "excluded" && ` (税抜 ${Number(cost).toLocaleString()}円)`}
              </span>
            </Flex>
            <Flex justify="space-between" color="gray.700">
              <span>販売・決済手数料額（{feeRate}%）：</span>
              <span className="font-mono font-medium text-amber-600">
                - {calculation.isValid ? calculation.feeAmount.toLocaleString() : "0"} 円
              </span>
            </Flex>
            <Flex justify="space-between" color="gray.700">
              <span>配送料・梱包資材費：</span>
              <span className="font-mono font-medium text-blue-600">
                - {Number(shippingAndPacking).toLocaleString()} 円
              </span>
            </Flex>
            <Divider my={1.5} />
            <Flex justify="space-between" fontWeight="bold" color="gray.900" fontSize={{ base: "sm", md: "md" }}>
              <span>合計直接コスト：</span>
              <span className="font-mono">
                {calculation.isValid
                  ? (calculation.taxIncludedCost + calculation.feeAmount + Number(shippingAndPacking)).toLocaleString()
                  : "0"}{" "}
                円
              </span>
            </Flex>
          </Stack>
        </Box>

        {/* ワンクリック結果コピーボタン */}
        <Button
          leftIcon={copied ? <FiCheck /> : <FiCopy />}
          colorScheme={copied ? "green" : "teal"}
          size="lg"
          width="100%"
          onClick={handleCopyResult}
          borderRadius="xl"
          fontWeight="bold"
          fontSize={{ base: "md", md: "lg" }}
          py={6}
          shadow="sm"
          className="transition-all hover:shadow-md"
        >
          {copied ? "コピー完了！" : "計算結果を1クリックでコピー"}
        </Button>
      </Stack>
    </Grid>
  );
};

export default GrossProfitMarginCalculator;
