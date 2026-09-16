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
  SimpleGrid,
  Input,
  Select,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import {
  FiClock,
  FiTruck,
  FiCalendar,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";

const TimeSpanCalculatorFeature = () => {
  const toast = useToast();
  const toastPosition = useBreakpointValue({ base: "bottom", md: "top" });

  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [now]);

  const currentTimeStr = useMemo(() => {
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${min}`;
  }, [now]);

  // ----------------------------------------------------
  // タブ1: リードタイム計算ステート
  // ----------------------------------------------------
  const [orderDate, setOrderDate] = useState(todayStr); // 注文受付日
  const [orderTime, setOrderTime] = useState(currentTimeStr); // 注文受付時刻
  const [cutoffTime, setCutoffTime] = useState("14:00"); // 当日出荷の締切時刻
  const [shipLeadDays, setShipLeadDays] = useState(0); // 出荷リードタイム (0:即日, 1:翌日, 2:2営業日後)
  const [transitDays, setTransitDays] = useState(1); // 配送所要日数 (1:翌日着, 2:翌々日着)
  const [warehouseHoliday, setWarehouseHoliday] = useState("weekends_holidays"); // 'weekends_holidays' | 'none' (365日出荷)
  const [deliveryTimeBand, setDeliveryTimeBand] = useState("unspecified"); // 配送時間帯
  const [copiedLeadTime, setCopiedLeadTime] = useState(false);

  // ----------------------------------------------------
  // タブ2: 期間・日数計算ステート
  // ----------------------------------------------------
  const [calcMode, setCalcMode] = useState("diff"); // 'diff' (2日時の差) | 'add' (◯日後加算)
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-01-01`);
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState(`${now.getFullYear()}-12-31`);
  const [endTime, setEndTime] = useState("23:59");
  const [includeBothEnds, setIncludeBothEnds] = useState(false); // 両端入れ (true) / 片端入れ (false)

  // ◯日後加算モード用
  const [baseDate, setBaseDate] = useState(todayStr);
  const [baseTime, setBaseTime] = useState("12:00");
  const [addDays, setAddDays] = useState(7);
  const [addHours, setAddHours] = useState(0);
  const [addDirection, setAddDirection] = useState("forward"); // 'forward' (+後) | 'backward' (-前)
  const [copiedSpan, setCopiedSpan] = useState(false);

  // ====================================================
  // タブ1: リードタイム計算ロジック
  // ====================================================
  const leadTimeCalc = useMemo(() => {
    if (!orderDate || !orderTime) return { isValid: false };

    const [orderH, orderM] = orderTime.split(":").map(Number);
    const [cutH, cutM] = cutoffTime.split(":").map(Number);

    // 締切時刻を過ぎているか判定
    const isPastCutoff = orderH > cutH || (orderH === cutH && orderM >= cutM);

    // 出荷起算日を決定
    let current = new Date(`${orderDate}T00:00:00`);
    if (isNaN(current.getTime())) return { isValid: false };

    // 締切過ぎなら翌日へ
    if (isPastCutoff) {
      current.setDate(current.getDate() + 1);
    }

    // 倉庫休業日判定（土日祝休業の場合：土日をスキップ）
    const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

    if (warehouseHoliday === "weekends_holidays") {
      while (isWeekend(current)) {
        current.setDate(current.getDate() + 1);
      }
    }

    // 出荷リードタイム日数を消化
    let remainingShipDays = parseInt(shipLeadDays, 10) || 0;
    while (remainingShipDays > 0) {
      current.setDate(current.getDate() + 1);
      if (warehouseHoliday === "weekends_holidays") {
        if (!isWeekend(current)) {
          remainingShipDays--;
        }
      } else {
        remainingShipDays--;
      }
    }

    const shippingDate = new Date(current);
    const shippingDateStr = shippingDate.toISOString().split("T")[0];

    // 配送日数（運送会社は年中無休で動く前提で暦日加算）
    const tDays = parseInt(transitDays, 10) || 1;
    const deliveryDate = new Date(shippingDate);
    deliveryDate.setDate(deliveryDate.getDate() + tDays);
    const deliveryDateStr = deliveryDate.toISOString().split("T")[0];

    // 注文日時からお届け予定日までの総所要時間（時間単位）
    const orderDateTime = new Date(`${orderDate}T${orderTime}:00`);
    const deliveryDateTime = new Date(`${deliveryDateStr}T12:00:00`); // 正午着基準
    const diffMs = Math.max(0, deliveryDateTime - orderDateTime);
    const totalHours = Math.round(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(totalHours / 24);
    const remainHours = totalHours % 24;

    // 曜日文字列
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const shipDayName = dayNames[shippingDate.getDay()];
    const delivDayName = dayNames[deliveryDate.getDay()];

    return {
      isValid: true,
      isPastCutoff,
      shippingDateStr,
      shipDayName,
      deliveryDateStr,
      delivDayName,
      totalHours,
      totalDays,
      remainHours,
    };
  }, [orderDate, orderTime, cutoffTime, shipLeadDays, transitDays, warehouseHoliday]);

  // ====================================================
  // タブ2: 期間・日時計算ロジック
  // ====================================================
  const spanCalc = useMemo(() => {
    if (calcMode === "diff") {
      if (!startDate || !endDate) return { isValid: false };
      const start = new Date(`${startDate}T${startTime}:00`);
      const end = new Date(`${endDate}T${endTime}:00`);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return { isValid: false };

      const diffMs = end - start;
      const isPositive = diffMs >= 0;
      const absDiffMs = Math.abs(diffMs);

      const totalMinutes = Math.floor(absDiffMs / (1000 * 60));
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;

      // カレンダー日数
      const startDateOnly = new Date(`${startDate}T00:00:00`);
      const endDateOnly = new Date(`${endDate}T00:00:00`);
      const calendarDaysBase = Math.round(Math.abs(endDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
      const calendarDays = includeBothEnds ? calendarDaysBase + 1 : calendarDaysBase;

      const weeks = (calendarDays / 7).toFixed(1);
      const months = (calendarDays / 30.4375).toFixed(1);

      return {
        isValid: true,
        isPositive,
        totalHours,
        totalMinutes,
        days,
        hours,
        minutes,
        calendarDays,
        weeks,
        months,
      };
    } else {
      // ◯日後加算モード
      if (!baseDate) return { isValid: false };
      const base = new Date(`${baseDate}T${baseTime}:00`);
      if (isNaN(base.getTime())) return { isValid: false };

      const target = new Date(base);
      const d = parseInt(addDays, 10) || 0;
      const h = parseInt(addHours, 10) || 0;

      const totalMs = (d * 24 + h) * 60 * 60 * 1000;
      if (addDirection === "forward") {
        target.setTime(target.getTime() + totalMs);
      } else {
        target.setTime(target.getTime() - totalMs);
      }

      const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
      const targetDateStr = target.toISOString().split("T")[0];
      const targetTimeStr = `${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;
      const targetDayName = dayNames[target.getDay()];

      return {
        isValid: true,
        targetDateStr,
        targetTimeStr,
        targetDayName,
      };
    }
  }, [calcMode, startDate, startTime, endDate, endTime, includeBothEnds, baseDate, baseTime, addDays, addHours, addDirection]);

  // ----------------------------------------------------
  // コピー処理
  // ----------------------------------------------------
  const handleCopyLeadTime = () => {
    if (!leadTimeCalc.isValid) return;
    const text = `【最短お届け予定日のご案内】
■ ご注文受付：${orderDate} ${orderTime}
■ 発送予定日：${leadTimeCalc.shippingDateStr}(${leadTimeCalc.shipDayName}) 発送
■ お届け予定日：${leadTimeCalc.deliveryDateStr}(${leadTimeCalc.delivDayName}) ${deliveryTimeBand === "unspecified" ? "着" : `${deliveryTimeBand}着`}
━━━━━━━━━━━━━━━━━━━━
■ 総所要時間：約 ${leadTimeCalc.totalHours} 時間（${leadTimeCalc.totalDays}日${leadTimeCalc.remainHours}時間）
※ 交通状況や天候、地域によりお届け日時が前後する場合がございます。
EC Tool Crate | リードタイム計算ツール
https://ec-tool-crate.com/time-span-calculator`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedLeadTime(true);
      toast({
        title: "お届け案内テキストをコピーしました",
        description: "商品ページや受注確認メールにそのまま貼り付けられます。",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedLeadTime(false), 2000);
    });
  };

  const handleCopySpan = () => {
    if (!spanCalc.isValid) return;
    let text = "";
    if (calcMode === "diff") {
      text = `【期間日時・総時間計算結果】
■ 期間：${startDate} ${startTime} 〜 ${endDate} ${endTime}
■ 総所要時間：${spanCalc.totalHours.toLocaleString()} 時間（${spanCalc.days}日 ${spanCalc.hours}時間 ${spanCalc.minutes}分）
■ カレンダー日数：${spanCalc.calendarDays} 日間（${includeBothEnds ? "両端入れ" : "片端入れ"}）
EC Tool Crate | リードタイム・期間日時計算ツール
https://ec-tool-crate.com/time-span-calculator`;
    } else {
      text = `【日付加算計算結果】
■ 基準日時：${baseDate} ${baseTime}
■ 計算条件：${addDays}日 ${addHours}時間 ${addDirection === "forward" ? "後" : "前"}
■ 計算結果日時：${spanCalc.targetDateStr}(${spanCalc.targetDayName}) ${spanCalc.targetTimeStr}
EC Tool Crate | リードタイム・期間日時計算ツール
https://ec-tool-crate.com/time-span-calculator`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSpan(true);
      toast({
        title: "計算結果テキストをコピーしました",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedSpan(false), 2000);
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
            <FiTruck />
            <span>① 発送・お届けリードタイム計算</span>
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
            <FiClock />
            <span>② 期間・日時の差 & ◯日後計算</span>
          </Flex>
        </Tab>
      </TabList>

      <TabPanels>
        {/* ==================================================== */}
        {/* タブ1: リードタイム計算パネル */}
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
              gap={5}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
            >
              <Flex justify="space-between" align="center">
                <MainContentsHeading heading="受注・配送条件の設定" />
                <Badge colorScheme="green" variant="subtle" px={2.5} py={1} borderRadius="md" fontSize="xs">
                  即時自動計算
                </Badge>
              </Flex>

              {/* 注文受付日時 */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1.5}>
                  ご注文・ご発注受付日時
                </Text>
                <Grid templateColumns="3fr 2fr" gap={3}>
                  <Input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                  <Input
                    type="time"
                    value={orderTime}
                    onChange={(e) => setOrderTime(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                </Grid>
                <Flex gap={2} mt={2}>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setOrderDate(todayStr);
                      setOrderTime(currentTimeStr);
                    }}
                  >
                    現在日時にセット
                  </Button>
                </Flex>
              </Box>

              {/* 当日出荷の締切時刻（カットオフ） */}
              <Box p={3.5} bg="#f8f9fa" borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Flex justify="space-between" align="center" mb={1.5}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    当日発送の締切時刻（カットオフタイム）
                  </Text>
                  <Badge colorScheme={leadTimeCalc.isPastCutoff ? "orange" : "green"} fontSize="11px">
                    {leadTimeCalc.isPastCutoff ? "締切後（翌営業日扱い）" : "締切前（当日発送対象）"}
                  </Badge>
                </Flex>
                <Select
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  size="sm"
                  bg="white"
                  borderRadius="md"
                >
                  <option value="12:00">12:00（正午締切）</option>
                  <option value="13:00">13:00 締切</option>
                  <option value="14:00">14:00 締切（標準）</option>
                  <option value="15:00">15:00 締切</option>
                  <option value="16:00">16:00 締切</option>
                  <option value="23:59">終日（当日23:59まで）</option>
                </Select>
                <Text fontSize="11px" color="gray.500" mt={1}>
                  ※ 締切時刻以降のご注文は、自動的に翌日以降の出荷として計算されます。
                </Text>
              </Box>

              {/* リードタイム日数設定 */}
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                    出荷リードタイム
                  </Text>
                  <Select
                    value={shipLeadDays}
                    onChange={(e) => setShipLeadDays(Number(e.target.value))}
                    size="sm"
                    borderRadius="md"
                  >
                    <option value={0}>即日・当日発送（0日）</option>
                    <option value={1}>翌営業日発送（1日）</option>
                    <option value={2}>2営業日後発送</option>
                    <option value={3}>3営業日後発送</option>
                    <option value={5}>5営業日後発送</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                    配送所要日数（目安）
                  </Text>
                  <Select
                    value={transitDays}
                    onChange={(e) => setTransitDays(Number(e.target.value))}
                    size="sm"
                    borderRadius="md"
                  >
                    <option value={1}>翌日着（本州近隣・1日）</option>
                    <option value={2}>翌々日着（中1日・北海道/九州等）</option>
                    <option value={3}>3日後着（沖縄・離島等）</option>
                  </Select>
                </Box>
              </Grid>

              {/* 倉庫休業日 & 時間帯 */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1.5}>
                  出荷倉庫の営業日体制
                </Text>
                <RadioGroup onChange={setWarehouseHoliday} value={warehouseHoliday} colorScheme="green">
                  <HStack gap={4}>
                    <Radio value="weekends_holidays" size="sm">
                      <Text fontSize="xs">土日祝休業（標準）</Text>
                    </Radio>
                    <Radio value="none" size="sm">
                      <Text fontSize="xs">365日年中無休で出荷</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                  配送希望時間帯（告知テキスト用）
                </Text>
                <Select
                  value={deliveryTimeBand}
                  onChange={(e) => setDeliveryTimeBand(e.target.value)}
                  size="sm"
                  borderRadius="md"
                >
                  <option value="unspecified">指定なし</option>
                  <option value="午前中">午前中</option>
                  <option value="14:00〜16:00">14:00〜16:00</option>
                  <option value="16:00〜18:00">16:00〜18:00</option>
                  <option value="18:00〜20:00">18:00〜20:00</option>
                  <option value="19:00〜21:00">19:00〜21:00</option>
                </Select>
              </Box>
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
                <Flex justify="space-between" align="center" mb={3}>
                  <MainContentsHeading heading="リードタイム試算結果" />
                  <Badge colorScheme="green" fontSize="12px" px={2.5} py={1}>
                    所要 約 {leadTimeCalc.totalHours} 時間
                  </Badge>
                </Flex>

                {/* メイン結果：お届け予定日 */}
                <Box my={3} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                  <Text fontSize="xs" color="gray.600" fontWeight="bold">
                    最短お届け予定日時（着荷目安）
                  </Text>
                  <Flex align="baseline" gap={2} my={1.5}>
                    <Text fontSize={{ base: "26px", md: "34px" }} fontWeight="bold" color="green.700" className="font-mono">
                      {leadTimeCalc.isValid ? `${leadTimeCalc.deliveryDateStr} (${leadTimeCalc.delivDayName})` : "-"}
                    </Text>
                    {deliveryTimeBand !== "unspecified" && (
                      <Badge colorScheme="teal" fontSize="13px">
                        {deliveryTimeBand}
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="xs" color="gray.500">
                    ご注文からお届けまで：<strong>約 {leadTimeCalc.totalDays} 日 {leadTimeCalc.remainHours} 時間</strong>
                  </Text>
                </Box>

                {/* サブ結果グリッド */}
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={5}>
                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize="xs" color="gray.600" fontWeight="bold">
                      発送予定日
                    </Text>
                    <Text fontSize="20px" fontWeight="bold" color="blue.700" fontFamily="mono" my={1}>
                      {leadTimeCalc.shippingDateStr} ({leadTimeCalc.shipDayName})
                    </Text>
                    <Text fontSize="11px" color="gray.500">
                      {leadTimeCalc.isPastCutoff ? "※締切後のため翌稼働日出荷" : "※当日発送対象"}
                    </Text>
                  </Box>

                  <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Text fontSize="xs" color="gray.600" fontWeight="bold">
                      配送リードタイム
                    </Text>
                    <Text fontSize="20px" fontWeight="bold" color="gray.800" fontFamily="mono" my={1}>
                      {transitDays} 日間（中{transitDays - 1}日）
                    </Text>
                    <Text fontSize="11px" color="gray.500">
                      出荷からお届けまでの輸送日数
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* 最短お届け告知テキスト コピーボタン */}
                <Button
                  leftIcon={copiedLeadTime ? <FiCheck /> : <FiCopy />}
                  colorScheme={copiedLeadTime ? "green" : "teal"}
                  size="lg"
                  width="100%"
                  onClick={handleCopyLeadTime}
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  py={6}
                >
                  {copiedLeadTime ? "お届け案内テキストをコピーしました！" : "最短お届け案内テキストを1クリックコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ2: 期間・日時計算パネル */}
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
              gap={5}
              p={{ base: 5, md: 7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
            >
              <MainContentsHeading heading="期間・日時の条件入力" />

              {/* 計算モード選択 */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1.5}>
                  計算メニュー
                </Text>
                <RadioGroup onChange={setCalcMode} value={calcMode} colorScheme="green">
                  <HStack gap={4}>
                    <Radio value="diff" size="sm">
                      <Text fontSize="sm">2つの日時の差（総時間・日数）</Text>
                    </Radio>
                    <Radio value="add" size="sm">
                      <Text fontSize="sm">基準日 ＋ ◯日後・◯時間後</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              {calcMode === "diff" ? (
                <>
                  {/* 開始日時 */}
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                      開始日時
                    </Text>
                    <Grid templateColumns="3fr 2fr" gap={3}>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                    </Grid>
                  </Box>

                  {/* 終了日時 */}
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                      終了日時
                    </Text>
                    <Grid templateColumns="3fr 2fr" gap={3}>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                    </Grid>
                  </Box>

                  {/* 端数・カウント方式 */}
                  <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1.5}>
                      カレンダー日数のカウント方式
                    </Text>
                    <RadioGroup
                      onChange={(val) => setIncludeBothEnds(val === "both")}
                      value={includeBothEnds ? "both" : "one"}
                      colorScheme="green"
                    >
                      <HStack gap={4}>
                        <Radio value="one" size="sm">
                          <Text fontSize="xs">片端入れ（経過日数）</Text>
                        </Radio>
                        <Radio value="both" size="sm">
                          <Text fontSize="xs">両端入れ（初日・末日含む）</Text>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </Box>
                </>
              ) : (
                <>
                  {/* 基準日時 */}
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                      基準日時
                    </Text>
                    <Grid templateColumns="3fr 2fr" gap={3}>
                      <Input
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                      <Input
                        type="time"
                        value={baseTime}
                        onChange={(e) => setBaseTime(e.target.value)}
                        size="sm"
                        borderRadius="md"
                      />
                    </Grid>
                  </Box>

                  {/* 加算日数・時間 */}
                  <Grid templateColumns="1fr 1fr" gap={3}>
                    <NumberInputForm
                      id="add-days"
                      label="加算日数"
                      value={addDays}
                      min={0}
                      max={1000}
                      step={1}
                      unit="日"
                      onChange={(val) => setAddDays(parseInt(val, 10) || 0)}
                    />
                    <NumberInputForm
                      id="add-hours"
                      label="加算時間"
                      value={addHours}
                      min={0}
                      max={24}
                      step={1}
                      unit="時間"
                      onChange={(val) => setAddHours(parseInt(val, 10) || 0)}
                    />
                  </Grid>

                  {/* 前後方向 */}
                  <Box>
                    <RadioGroup onChange={setAddDirection} value={addDirection} colorScheme="green">
                      <HStack gap={4}>
                        <Radio value="forward" size="sm">
                          <Text fontSize="xs">指定日数「後」の日時を計算</Text>
                        </Radio>
                        <Radio value="backward" size="sm">
                          <Text fontSize="xs">指定日数「前」の日時を計算</Text>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </Box>
                </>
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
                <MainContentsHeading heading="計算結果" />

                {calcMode === "diff" ? (
                  <>
                    {/* メイン結果：総時間 */}
                    <Box my={3} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                      <Text fontSize="xs" color="gray.600" fontWeight="bold">
                        総時間（セール・イベント総時間）
                      </Text>
                      <Flex align="baseline" gap={2} my={1.5}>
                        <Text fontSize={{ base: "32px", md: "40px" }} fontWeight="bold" color="green.700" className="font-mono leading-none">
                          {spanCalc.isValid ? spanCalc.totalHours.toLocaleString() : 0}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">時間</Text>
                      </Flex>
                      <Text fontSize="xs" color="gray.500">
                        経過時間：<strong>{spanCalc.days} 日 {spanCalc.hours} 時間 {spanCalc.minutes} 分</strong>
                      </Text>
                    </Box>

                    {/* サブ結果グリッド */}
                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={5}>
                      <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                        <Text fontSize="xs" color="gray.600" fontWeight="bold">カレンダー日数</Text>
                        <Text fontSize="22px" fontWeight="bold" color="blue.700" fontFamily="mono" my={1}>
                          {spanCalc.calendarDays} 日間
                        </Text>
                        <Text fontSize="11px" color="gray.500">
                          {includeBothEnds ? "両端入れ（初日・末日含む）" : "片端入れ（経過日数）"}
                        </Text>
                      </Box>
                      <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                        <Text fontSize="xs" color="gray.600" fontWeight="bold">週数・月数換算</Text>
                        <Text fontSize="18px" fontWeight="bold" color="gray.800" fontFamily="mono" my={1}>
                          約 {spanCalc.weeks} 週間
                        </Text>
                        <Text fontSize="11px" color="gray.500">（約 {spanCalc.months} ヶ月間）</Text>
                      </Box>
                    </SimpleGrid>
                  </>
                ) : (
                  <>
                    {/* メイン結果：計算後日時 */}
                    <Box my={4} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                      <Text fontSize="xs" color="gray.600" fontWeight="bold">
                        計算後の日時
                      </Text>
                      <Flex align="baseline" gap={2} my={1.5}>
                        <Text fontSize={{ base: "26px", md: "34px" }} fontWeight="bold" color="green.700" className="font-mono">
                          {spanCalc.isValid ? `${spanCalc.targetDateStr} (${spanCalc.targetDayName})` : "-"}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                          {spanCalc.isValid ? spanCalc.targetTimeStr : ""}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" color="gray.500">
                        基準日より {addDays}日 {addHours}時間 {addDirection === "forward" ? "後" : "前"}
                      </Text>
                    </Box>
                  </>
                )}

                <Button
                  leftIcon={copiedSpan ? <FiCheck /> : <FiCopy />}
                  colorScheme={copiedSpan ? "green" : "teal"}
                  size="lg"
                  width="100%"
                  onClick={handleCopySpan}
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  py={6}
                >
                  {copiedSpan ? "計算結果をコピーしました！" : "計算結果テキストを1クリックコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TimeSpanCalculatorFeature;
