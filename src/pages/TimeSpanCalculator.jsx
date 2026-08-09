// src/TimeSpanCalculator.js
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Grid,
  HStack,
  Flex,
  Box,
  Tooltip,
  useToast,
  ButtonGroup,
  FormErrorMessage,
  useBreakpointValue,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import PageTitle from "../components/PageTitle";
import MainContentsHeading from "../components/MainContentsHeading";
import usePageMetadata from "../hooks/usePageMetadata";
import { FiInfo, FiRefreshCw } from "react-icons/fi";
import ExecuteButton from "../components/ExecuteButton";
import ToolGuideSection from "../components/ToolGuideSection";

function TimeSpanCalculator() {
  usePageMetadata({
    title: "期間日時計算ツール | EC Tool Crate",
    description:
      "開始日時と終了日時を入力すると、期間中の日数と総時間を計算します。プロジェクトの期間やイベントのスケジュール管理、セールバナー制作時の「◯日間限定」や「〇〇時間限定」表記などにお使いください",
    canonicalUrl: "https://ec-tool-crate.com/time-span-calculator",
    ogTitle: "期間日時計算ツール | EC Tool Crate",
    ogDescription:
      "開始日時と終了日時を入力すると、期間中の日数と総時間を計算します。プロジェクトの期間やイベントのスケジュール管理、セールバナー制作時の「◯日間限定」や「〇〇時間限定」表記などにお使いください",
    ogType: "website"
  });

  const today = new Date();
  const [startDate, setStartDate] = useState(
    `${today.getFullYear()}-01-01 00:00`
  );
  const [endDate, setEndDate] = useState(`${today.getFullYear()}-12-31 23:59`);
  const [result, setResult] = useState({
    calendarDaysBoth: 0,
    calendarDaysOne: 0,
    elapsedDays: 0,
    elapsedHours: 0,
    elapsedMinutes: 0,
    totalHours: 0,
    hasResult: false,
  });
  const [isStartDateInvalid, setIsStartDateInvalid] = useState(false);
  const [isEndDateInvalid, setIsEndDateInvalid] = useState(false);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  // 日時が変更されたときのハンドラー
  const handleStartDateChange = (event) => {
    setIsStartDateInvalid(false);
    setIsEndDateInvalid(false);
    setStartDate(event.target.value);
    setResult({
      calendarDaysBoth: 0,
      calendarDaysOne: 0,
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      totalHours: 0,
      hasResult: false,
    });
  };

  const handleEndDateChange = (event) => {
    setIsStartDateInvalid(false);
    setIsEndDateInvalid(false);
    setEndDate(event.target.value);
    setResult({
      calendarDaysBoth: 0,
      calendarDaysOne: 0,
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      totalHours: 0,
      hasResult: false,
    });
  };

  // 計算を実行する関数
  const calculateDifference = () => {
    setResult({
      calendarDaysBoth: 0,
      calendarDaysOne: 0,
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      totalHours: 0,
      hasResult: false,
    });

    // 入力値の検証
    if (!startDate || !endDate) {
      if (!startDate) {
        setIsStartDateInvalid(true);
      }
      if (!endDate) {
        setIsEndDateInvalid(true);
      }
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 日付オブジェクトが有効か確認
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast({
        title: "日時が無効です",
        description: "有効な日時を入力してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }

    // 終了日時が開始日時より前でないか確認
    if (end < start) {
      toast({
        title: "期間が無効です",
        description: "終了日時は開始日時より後である必要があります。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }

    // ミリ秒単位で差を計算
    const diffInMilliseconds = end.getTime() - start.getTime();

    // 1. 実経過時間の計算
    const totalHours = diffInMilliseconds / (1000 * 60 * 60);
    const elapsedDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const elapsedHours = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const elapsedMinutes = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    // 2. 日数換算（日付のみの計算）
    const startDateOnly = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endDateOnly = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );
    const dateDiffMs = endDateOnly.getTime() - startDateOnly.getTime();
    const dateDiffDays = Math.round(dateDiffMs / (1000 * 60 * 60 * 24));

    const calendarDaysBoth = dateDiffDays + 1;
    const calendarDaysOne = dateDiffDays;

    setResult({
      calendarDaysBoth,
      calendarDaysOne,
      elapsedDays,
      elapsedHours,
      elapsedMinutes,
      totalHours: parseFloat(totalHours.toFixed(1)),
      hasResult: true,
    });
    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: toastPosition,
    });
  };

  const resetForm = () => {
    setStartDate(`${today.getFullYear()}-01-01 00:00`);
    setEndDate(`${today.getFullYear()}-12-31 23:59`);
    setResult({
      calendarDaysBoth: 0,
      calendarDaysOne: 0,
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      totalHours: 0,
      hasResult: false,
    });
    toast({
      title: "日時と計算結果をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

// (TimeSpanCalculator 内)
  const guideData = {
    title: "期間日時計算ツール",
    summary:
      "2つの日時の間の正確な経過日数・総時間数を一瞬で計算するツールの決定版です。プロジェクトの所要時間計算やイベント開催期間、ECサイトのキャンペーンバナーにおける「◯時間限定セール」表記の計算などに役立ちます。",
    logicSteps: [
      {
        title: "経過ミリ秒の算出",
        formula: "経過ミリ秒 = 終了日時.getTime() - 開始日時.getTime()",
        description: "入力された2つの日時をタイムスタンプ（ミリ秒）に変換して差分を求めます。",
      },
      {
        title: "日数および総時間への換算",
        formula: "総時間 = 経過ミリ秒 ÷ (1000 × 60 × 60)",
        description: "ミリ秒を1日単位（24時間）および総時間単位に換算して表示します。",
      },
    ],
    useCases: [
      {
        title: "ECバナー・LP制作時の「◯時間限定」算出",
        description:
          "「金曜18:00〜日曜23:59まで」のセール期間が合計何時間になるかを計算し、バナーキャッチコピーの参考に。",
      },
      {
        title: "プロジェクトの作業工数・リードタイム計測",
        description: "タスク着手から完了までの実際の経過時間を正確に計測して記録。",
      },
    ],
    faqs: [
      {
        question: "「日数換算（カレンダー日数）」と「時間換算（経過時間）」の違いは何ですか？",
        answer:
          "「日数換算」は時間を考慮せず、日付の差のみから算出します。例えば1月1日0:00〜12月31日23:59はカレンダー上で365日間あるため、日数換算（両端入れ）では「365日」となります。一方、「時間換算」は実経過時間を計算するため「364日23時間59分」となり、丸24時間を満たした日数としては「364日」となります。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"⏳ 期間日時計算ツール"}
        pageDescription={
          "開始日時と終了日時を入力すると、期間中の日数と総時間を計算します。プロジェクトの期間やイベントのスケジュール管理、セールバナー制作時の「◯日間限定」や「〇〇時間限定」表記などにお使いください"
        }
      />
      <Grid
        alignItems="start"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={8}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
          }

          grid-template-columns: 1fr;
        `}
      >
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="日時選択" />
          {/* 開始日時の入力フォーム */}
          <FormControl id="start-date" isInvalid={isStartDateInvalid}>
            <FormLabel htmlFor="start" _hover={{ cursor: "pointer" }}>
              開始日時
            </FormLabel>
            <Input
              id="start"
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
              aria-labelledby="期間開始日"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              backgroundColor={"colorWhite"}
              size="lg"
            />
            {isStartDateInvalid && (
              <FormErrorMessage>日付を選択してください</FormErrorMessage>
            )}
          </FormControl>

          {/* 終了日時の入力フォーム */}
          <FormControl id="end-date" isInvalid={isEndDateInvalid}>
            <FormLabel htmlFor="end" _hover={{ cursor: "pointer" }}>
              終了日時
            </FormLabel>
            <Input
              id="end"
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
              aria-labelledby="期間終了日"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              backgroundColor={"colorWhite"}
              size="lg"
            />
            {isEndDateInvalid && (
              <FormErrorMessage>日付を選択してください</FormErrorMessage>
            )}
          </FormControl>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton buttonFunc={calculateDifference} text="計算する" />
            <ExecuteButton
              icon={<FiRefreshCw />}
              variant="outline"
              buttonFunc={resetForm}
              text="リセット"
            />
          </ButtonGroup>
        </Stack>
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
          bg="colorGrayLightest"
        >
          <MainContentsHeading heading="計算結果" />
          
          {!result.hasResult ? (
            <Box py={8} textAlign="center" color="colorGrayDark">
              「計算する」ボタンをクリックすると結果が表示されます。
            </Box>
          ) : (
            <Stack gap={4}>
              {/* 日数換算カード */}
              <Box bg="colorWhite" p={4} borderRadius="md" borderWidth="1px" borderColor="colorGray" boxShadow="sm">
                <Text fontWeight="bold" color="primary" mb={3} fontSize="sm">
                  📅 日数換算（日付のみの計算）
                </Text>
                <Stack gap={3}>
                  <Flex justify="space-between" align="center" borderBottom="1px" borderColor="colorGrayLight" pb={2}>
                    <HStack gap={1}>
                      <Text fontSize="sm" fontWeight="semibold">両端入れ</Text>
                      <Tooltip label="開始日と終了日を両方含めてカウントします（例：1月1日〜12月31日は365日）。キャンペーンやセール期間の表記などに適しています。" hasArrow placement="top">
                        <Box as="span" display="inline-flex" alignItems="center"><FiInfo color="#787774" /></Box>
                      </Tooltip>
                    </HStack>
                    <Flex align="baseline">
                      <Text fontSize="2xl" fontWeight="bold" color="black">{result.calendarDaysBoth}</Text>
                      <Text fontSize="sm" ml={1} color="colorGrayDark">日</Text>
                    </Flex>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <HStack gap={1}>
                      <Text fontSize="sm" fontWeight="semibold">片端入れ（差分）</Text>
                      <Tooltip label="開始日か終了日の片方のみを含めます（例：1月1日〜12月31日は364日）。純粋なカレンダー上の差分です。" hasArrow placement="top">
                        <Box as="span" display="inline-flex" alignItems="center"><FiInfo color="#787774" /></Box>
                      </Tooltip>
                    </HStack>
                    <Flex align="baseline">
                      <Text fontSize="2xl" fontWeight="bold" color="black">{result.calendarDaysOne}</Text>
                      <Text fontSize="sm" ml={1} color="colorGrayDark">日</Text>
                    </Flex>
                  </Flex>
                </Stack>
              </Box>

              {/* 時間換算カード */}
              <Box bg="colorWhite" p={4} borderRadius="md" borderWidth="1px" borderColor="colorGray" boxShadow="sm">
                <Text fontWeight="bold" color="primary" mb={3} fontSize="sm">
                  ⏳ 時間換算（正確な経過時間）
                </Text>
                <Stack gap={3}>
                  <Flex justify="space-between" align="center" borderBottom="1px" borderColor="colorGrayLight" pb={2}>
                    <Text fontSize="sm" fontWeight="semibold">経過時間</Text>
                    <Flex align="baseline" flexWrap="wrap" justify="end">
                      {result.elapsedDays > 0 && (
                        <>
                          <Text fontSize="2xl" fontWeight="bold" color="black">{result.elapsedDays}</Text>
                          <Text fontSize="sm" mr={2} ml={0.5} color="colorGrayDark">日</Text>
                        </>
                      )}
                      <Text fontSize="2xl" fontWeight="bold" color="black">{result.elapsedHours}</Text>
                      <Text fontSize="sm" mr={2} ml={0.5} color="colorGrayDark">時間</Text>
                      {result.elapsedMinutes > 0 && (
                        <>
                          <Text fontSize="2xl" fontWeight="bold" color="black">{result.elapsedMinutes}</Text>
                          <Text fontSize="sm" ml={0.5} color="colorGrayDark">分</Text>
                        </>
                      )}
                    </Flex>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="semibold">総時間数</Text>
                    <Flex align="baseline">
                      <Text fontSize="2xl" fontWeight="bold" color="black">{result.totalHours}</Text>
                      <Text fontSize="sm" ml={1} color="colorGrayDark">時間</Text>
                    </Flex>
                  </Flex>
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Grid>
      <ToolGuideSection
        title={guideData.title}
        summary={guideData.summary}
        logicSteps={guideData.logicSteps}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default TimeSpanCalculator;
