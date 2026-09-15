import React, { useState, useMemo, useCallback } from "react";
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
  Tbody,
  Tr,
  Td,
  SimpleGrid,
  Input,
  Checkbox,
  CheckboxGroup,
  Textarea,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import {
  FiCalendar,
  FiMail,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import useNationalHolidays from "./hooks/useNationalHolidays";

const HolidayCalculatorFeature = () => {
  const toast = useToast();
  const toastPosition = useBreakpointValue({ base: "bottom", md: "top" });
  const { isDateHoliday, getHolidayName } = useNationalHolidays();

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // ----------------------------------------------------
  // タブ1: 年間休日・稼働日数ステート
  // ----------------------------------------------------
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [holidayRule, setHolidayRule] = useState("weekends_holidays"); // 'weekends_holidays' (土日祝) | 'weekends' (土日) | 'sundays_holidays' (日祝) | 'custom_weekdays' (曜日指定)
  const [customDays, setCustomDays] = useState(["0", "6"]); // 0:日, 6:土
  const [includeNationalHolidays, setIncludeNationalHolidays] = useState(true);
  const [extraHolidays, setExtraHolidays] = useState(5); // 年末年始・夏季休暇等の追加休日日数

  // ----------------------------------------------------
  // タブ2: 連休案内文ジェネレーターステート
  // ----------------------------------------------------
  const [holidayType, setHolidayType] = useState("year_end"); // 'year_end' | 'gw' | 'summer'
  const [companyName, setCompanyName] = useState("");
  const [holidayStart, setHolidayStart] = useState(`${currentYear}-12-29`);
  const [holidayEnd, setHolidayEnd] = useState(`${currentYear + 1}-01-04`);
  const [orderDeadline, setOrderDeadline] = useState(`${currentYear}-12-26 12:00`);
  const [finalShippingDate, setFinalShippingDate] = useState(`${currentYear}-12-27`);
  const [resumeDate, setResumeDate] = useState(`${currentYear + 1}-01-05`);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // ----------------------------------------------------
  // 共通の休日判定ヘルパー関数
  // ----------------------------------------------------
  const checkIsHoliday = useCallback(
    (dateObj, ruleType, customDaysArr, incNational) => {
      const dayOfWeek = dateObj.getDay(); // 0:日 〜 6:土
      const isNatHoliday = isDateHoliday(dateObj);

      if (ruleType === "weekends_holidays") {
        return dayOfWeek === 0 || dayOfWeek === 6 || isNatHoliday;
      }
      if (ruleType === "weekends") {
        return dayOfWeek === 0 || dayOfWeek === 6;
      }
      if (ruleType === "sundays_holidays") {
        return dayOfWeek === 0 || isNatHoliday;
      }
      if (ruleType === "custom_weekdays") {
        const isCustomDay = customDaysArr.includes(String(dayOfWeek));
        return isCustomDay || (incNational && isNatHoliday);
      }
      return false;
    },
    [isDateHoliday]
  );

  // ====================================================
  // タブ1: 年間休日・稼働日数計算ロジック
  // ====================================================
  const periodCalc = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) {
      return {
        isValid: false,
        totalDays: 0,
        holidayCount: 0,
        workingDays: 0,
        nationalHolidaysList: [],
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let holidayCount = 0;
    const nationalHolidaysList = [];
    const temp = new Date(start);

    while (temp <= end) {
      const isHoli = checkIsHoliday(
        temp,
        holidayRule,
        customDays,
        includeNationalHolidays
      );
      if (isHoli) {
        holidayCount++;
      }
      if (isDateHoliday(temp)) {
        nationalHolidaysList.push({
          date: temp.toISOString().split("T")[0],
          name: getHolidayName(temp) || "国民の祝日",
        });
      }
      temp.setDate(temp.getDate() + 1);
    }

    // 追加休日の加算（総日数を超えない範囲）
    const extra = parseInt(extraHolidays, 10) || 0;
    const finalHolidayCount = Math.min(totalDays, holidayCount + extra);
    const workingDays = Math.max(0, totalDays - finalHolidayCount);

    return {
      isValid: true,
      totalDays,
      holidayCount: finalHolidayCount,
      calendarHolidayCount: holidayCount,
      extraHolidays: extra,
      workingDays,
      nationalHolidaysList,
    };
  }, [
    startDate,
    endDate,
    holidayRule,
    customDays,
    includeNationalHolidays,
    extraHolidays,
    checkIsHoliday,
    isDateHoliday,
    getHolidayName,
  ]);

  // ====================================================
  // コピー処理
  // ====================================================
  const handleCopyNotice = () => {
    const text = `【休業および出荷スケジュールのご案内】

お取引先様 各位

拝啓 貴社ますますご清栄のこととお慶び申し上げます。
平素は格別のご高配を賜り、厚く御礼申し上げます。

誠に勝手ながら、弊社では下記期間を休業とさせていただきます。
連休前後は物流の混雑が予想されますので、お早めのご発注をいただけますようお願い申し上げます。

記

■ 休業期間
${holidayStart} 〜 ${holidayEnd}

■ 連休前 最終ご注文受付日時
${orderDeadline}

■ 連休前 最終出荷日
${finalShippingDate}

■ 連休明け 出荷・業務再開日
${resumeDate} より順次出荷

※ 休業期間中にいただいたお問い合わせ・ご注文につきましては、${resumeDate} 以降順次対応いたします。
ご不便をおかけいたしますが、何卒ご理解とご協力を賜りますようお願い申し上げます。

敬具
${companyName ? companyName : "EC Tool Crate"}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotice(true);
      toast({
        title: "休業案内メール文をコピーしました",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: toastPosition,
      });
      setTimeout(() => setCopiedNotice(false), 2000);
    });
  };

  // 連休プリセット変更
  const handleSelectPreset = (type) => {
    setHolidayType(type);
    if (type === "year_end") {
      setHolidayStart(`${currentYear}-12-29`);
      setHolidayEnd(`${currentYear + 1}-01-04`);
      setOrderDeadline(`${currentYear}-12-26 12:00`);
      setFinalShippingDate(`${currentYear}-12-27`);
      setResumeDate(`${currentYear + 1}-01-05`);
    } else if (type === "gw") {
      setHolidayStart(`${currentYear}-04-29`);
      setHolidayEnd(`${currentYear}-05-06`);
      setOrderDeadline(`${currentYear}-04-26 12:00`);
      setFinalShippingDate(`${currentYear}-04-27`);
      setResumeDate(`${currentYear}-05-07`);
    } else if (type === "summer") {
      setHolidayStart(`${currentYear}-08-11`);
      setHolidayEnd(`${currentYear}-08-16`);
      setOrderDeadline(`${currentYear}-08-08 12:00`);
      setFinalShippingDate(`${currentYear}-08-09`);
      setResumeDate(`${currentYear}-08-17`);
    }
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
            <FiCalendar />
            <span>① 年間休日 & 実働日数計算</span>
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
            <FiMail />
            <span>② 連休・出荷停止案内文ジェネレーター</span>
          </Flex>
        </Tab>
      </TabList>

      <TabPanels>
        {/* ==================================================== */}
        {/* タブ1: 年間休日・稼働日数パネル */}
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
              <MainContentsHeading heading="集計期間 & 休日条件の設定" />

              {/* 期間入力 */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700" mb={2}>
                  集計期間（開始日 〜 終了日）
                </Text>
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>開始日</Text>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      borderRadius="md"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>終了日</Text>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      borderRadius="md"
                    />
                  </Box>
                </Grid>

                {/* 期間プリセット */}
                <Flex gap={2} mt={2.5} flexWrap="wrap">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setStartDate(`${currentYear}-01-01`);
                      setEndDate(`${currentYear}-12-31`);
                    }}
                  >
                    今年（1/1〜12/31）
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setStartDate(`${currentYear}-04-01`);
                      setEndDate(`${currentYear + 1}-03-31`);
                    }}
                  >
                    今年度（4/1〜3/31）
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      const now = new Date();
                      const y = now.getFullYear();
                      const m = String(now.getMonth() + 1).padStart(2, "0");
                      const lastD = new Date(y, now.getMonth() + 1, 0).getDate();
                      setStartDate(`${y}-${m}-01`);
                      setEndDate(`${y}-${m}-${lastD}`);
                    }}
                  >
                    今月
                  </Button>
                </Flex>
              </Box>

              {/* 休日ルール */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700" mb={2.5}>
                  休日の判定ルール
                </Text>
                <RadioGroup onChange={setHolidayRule} value={holidayRule} colorScheme="green">
                  <Stack gap={2}>
                    <Radio value="weekends_holidays" size="sm">
                      <Text fontSize="sm">完全週休2日（土日 ＋ 国民の祝日）</Text>
                    </Radio>
                    <Radio value="weekends" size="sm">
                      <Text fontSize="sm">週休2日（土日のみ）</Text>
                    </Radio>
                    <Radio value="sundays_holidays" size="sm">
                      <Text fontSize="sm">週休1日（日曜 ＋ 国民の祝日）</Text>
                    </Radio>
                    <Radio value="custom_weekdays" size="sm">
                      <Text fontSize="sm">曜日指定・カスタム設定</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              {/* カスタム曜日設定 */}
              {holidayRule === "custom_weekdays" && (
                <Box p={3.5} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                    休業とする曜日を選択
                  </Text>
                  <CheckboxGroup
                    value={customDays}
                    onChange={(vals) => setCustomDays(vals)}
                    colorScheme="green"
                  >
                    <HStack gap={3} flexWrap="wrap">
                      {[
                        { label: "日", val: "0" },
                        { label: "月", val: "1" },
                        { label: "火", val: "2" },
                        { label: "水", val: "3" },
                        { label: "木", val: "4" },
                        { label: "金", val: "5" },
                        { label: "土", val: "6" },
                      ].map((d) => (
                        <Checkbox key={d.val} value={d.val} size="sm">
                          {d.label}
                        </Checkbox>
                      ))}
                    </HStack>
                  </CheckboxGroup>

                  <Divider my={2.5} />
                  <Checkbox
                    isChecked={includeNationalHolidays}
                    onChange={(e) => setIncludeNationalHolidays(e.target.checked)}
                    size="sm"
                    colorScheme="green"
                  >
                    <Text fontSize="xs">国民の祝日も休日に含める</Text>
                  </Checkbox>
                </Box>
              )}

              {/* 会社独自の特別休日日数 */}
              <Box>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                    夏季・年末年始等の追加休日日数（年計）
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    ※ 会社指定休・有給推奨日など
                  </Text>
                </Flex>
                <NumberInputForm
                  id="extra-holidays"
                  value={extraHolidays}
                  min={0}
                  max={100}
                  step={1}
                  unit="日"
                  onChange={(val) => setExtraHolidays(parseInt(val, 10) || 0)}
                />
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
                <MainContentsHeading heading="集計結果" />

                {/* メイン結果：実働日数 */}
                <Box my={4} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.200">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                    実働日数（稼働日・出勤日数）
                  </Text>
                  <Flex align="baseline" gap={2} my={1}>
                    <Text
                      fontSize={{ base: "36px", md: "44px" }}
                      fontWeight="bold"
                      color="green.700"
                      className="font-mono leading-none"
                    >
                      {periodCalc.isValid ? periodCalc.workingDays : 0}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      日
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.500">
                    全 {periodCalc.totalDays} 日間中の実質営業日数
                  </Text>
                </Box>

                {/* サブ結果グリッド */}
                {(() => {
                  const isNationalHolidayRelevant =
                    holidayRule === "weekends_holidays" ||
                    holidayRule === "sundays_holidays" ||
                    (holidayRule === "custom_weekdays" && includeNationalHolidays);

                  return (
                    <>
                      <SimpleGrid
                        columns={{
                          base: 1,
                          sm: isNationalHolidayRelevant ? 2 : 1,
                        }}
                        gap={4}
                        mb={5}
                      >
                        <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                            合計休日数
                          </Text>
                          <Flex align="baseline" gap={1.5} my={1}>
                            <Text fontSize="24px" fontWeight="bold" color="red.600" className="font-mono">
                              {periodCalc.isValid ? periodCalc.holidayCount : 0}
                            </Text>
                            <Text fontSize="xs" color="gray.600">日</Text>
                          </Flex>
                          <Text fontSize="11px" color="gray.500">
                            期間中の総休日数
                          </Text>
                        </Box>

                        {isNationalHolidayRelevant && (
                          <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                              期間内の祝日数
                            </Text>
                            <Flex align="baseline" gap={1.5} my={1}>
                              <Text fontSize="24px" fontWeight="bold" color="blue.700" className="font-mono">
                                {periodCalc.isValid ? periodCalc.nationalHolidaysList.length : 0}
                              </Text>
                              <Text fontSize="xs" color="gray.600">日</Text>
                            </Flex>
                            <Text fontSize="11px" color="gray.500">
                              対象期間の国民の祝日総数
                            </Text>
                          </Box>
                        )}
                      </SimpleGrid>

                      {/* 期間中の祝日一覧（祝日を含めるルールの場合のみ表示） */}
                      {isNationalHolidayRelevant && periodCalc.nationalHolidaysList.length > 0 && (
                        <Box mt={2} bg="white" p={3.5} borderRadius="lg" border="1px solid" borderColor="gray.200">
                          <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                            期間中の国民の祝日一覧（{periodCalc.nationalHolidaysList.length}日）
                          </Text>
                          <Box maxH="160px" overflowY="auto" fontSize="xs">
                            <Table size="sm" variant="simple">
                              <Tbody>
                                {periodCalc.nationalHolidaysList.map((h, i) => (
                                  <Tr key={i}>
                                    <Td py={1} fontFamily="mono" color="gray.600">{h.date}</Td>
                                    <Td py={1} fontWeight="medium" color="gray.800">{h.name}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        </Box>
                      )}
                    </>
                  );
                })()}
              </Box>
            </Stack>
          </Grid>
        </TabPanel>

        {/* ==================================================== */}
        {/* タブ2: 連休・休業案内文ジェネレーターパネル */}
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
              <MainContentsHeading heading="休業・出荷スケジュールの設定" />

              {/* プリセットボタン */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1.5}>
                  連休パターンの選択
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  <Button
                    size="sm"
                    variant={holidayType === "year_end" ? "solid" : "outline"}
                    colorScheme={holidayType === "year_end" ? "green" : "gray"}
                    onClick={() => handleSelectPreset("year_end")}
                  >
                    年末年始
                  </Button>
                  <Button
                    size="sm"
                    variant={holidayType === "gw" ? "solid" : "outline"}
                    colorScheme={holidayType === "gw" ? "green" : "gray"}
                    onClick={() => handleSelectPreset("gw")}
                  >
                    ゴールデンウィーク
                  </Button>
                  <Button
                    size="sm"
                    variant={holidayType === "summer" ? "solid" : "outline"}
                    colorScheme={holidayType === "summer" ? "green" : "gray"}
                    onClick={() => handleSelectPreset("summer")}
                  >
                    お盆・夏季休業
                  </Button>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                  貴社名 / ショップ名（署名用）
                </Text>
                <Input
                  placeholder="例: 株式会社〇〇 営業部"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  size="sm"
                  borderRadius="md"
                />
              </Box>

              <Grid templateColumns="1fr 1fr" gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>休業開始日</Text>
                  <Input
                    type="date"
                    value={holidayStart}
                    onChange={(e) => setHolidayStart(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>休業終了日</Text>
                  <Input
                    type="date"
                    value={holidayEnd}
                    onChange={(e) => setHolidayEnd(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                </Box>
              </Grid>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                  連休前 最終ご注文受付日時
                </Text>
                <Input
                  value={orderDeadline}
                  onChange={(e) => setOrderDeadline(e.target.value)}
                  placeholder="例: 12月26日(木) 12:00まで"
                  size="sm"
                  borderRadius="md"
                />
              </Box>

              <Grid templateColumns="1fr 1fr" gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>連休前 最終出荷日</Text>
                  <Input
                    type="date"
                    value={finalShippingDate}
                    onChange={(e) => setFinalShippingDate(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>連休明け 出荷再開日</Text>
                  <Input
                    type="date"
                    value={resumeDate}
                    onChange={(e) => setResumeDate(e.target.value)}
                    size="sm"
                    borderRadius="md"
                  />
                </Box>
              </Grid>
            </Stack>

            {/* プレビュー & コピーエリア */}
            <Stack gap={6}>
              <Box
                p={{ base: 5, md: 7 }}
                bg="#f0fdf4"
                border="2px solid"
                borderColor="green.400"
                borderRadius="xl"
                shadow="sm"
              >
                <MainContentsHeading heading="生成された案内メール文" />

                <Box my={3} bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="green.200">
                  <Textarea
                    value={`【休業および出荷スケジュールのご案内】

お取引先様 各位

拝啓 貴社ますますご清栄のこととお慶び申し上げます。
平素は格別のご高配を賜り、厚く御礼申し上げます。

誠に勝手ながら、弊社では下記期間を休業とさせていただきます。
連休前後は物流の混雑が予想されますので、お早めのご発注をいただけますようお願い申し上げます。

記

■ 休業期間
${holidayStart} 〜 ${holidayEnd}

■ 連休前 最終ご注文受付日時
${orderDeadline}

■ 連休前 最終出荷日
${finalShippingDate}

■ 連休明け 出荷・業務再開日
${resumeDate} より順次出荷

※ 休業期間中にいただいたお問い合わせ・ご注文につきましては、${resumeDate} 以降順次対応いたします。
ご不便をおかけいたしますが、何卒ご理解とご協力を賜りますようお願い申し上げます。

敬具
${companyName ? companyName : "EC Tool Crate"}`}
                    readOnly
                    rows={13}
                    fontSize="13px"
                    fontFamily="monospace"
                    bg="gray.50"
                    borderRadius="md"
                  />
                </Box>

                <Button
                  leftIcon={copiedNotice ? <FiCheck /> : <FiCopy />}
                  colorScheme={copiedNotice ? "green" : "teal"}
                  size="lg"
                  width="100%"
                  onClick={handleCopyNotice}
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  py={6}
                >
                  {copiedNotice ? "メール本文をコピーしました！" : "案内メール本文を1クリックコピー"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default HolidayCalculatorFeature;

