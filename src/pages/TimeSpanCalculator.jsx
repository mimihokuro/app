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

  const guideData = {
    title: "期間日時計算ツール",
    summary:
      "2つの日時の間の正確な経過日数・実経過時間（◯日◯時間◯分）・総時間数を一瞬で算出する高機能タイムスパン計算機です。プロジェクトの工数管理、ECサイトのタイムセール告知バナー制作（「◯日間限定」「72時間限定」等の表記）、定期購入の配送サイクル設計などに活用できます。",
    logicSteps: [
      {
        title: "実経過時間（ミリ秒タイムスタンプ差分）の計算",
        formula: "経過時間 = (終了日時 - 開始日時) ÷ (1000 × 60 × 60)",
        description:
          "開始日時と終了日時をそれぞれミリ秒（Unixタイムスタンプ）に変換し、厳密な差分から実経過時間（日・時間・分）を算出します。",
        example:
          "金曜 18:00 〜 日曜 23:59 の場合 → 2日 5時間 59分（総時間 53.98時間）",
      },
      {
        title: "カレンダー日数換算（両端入れ）",
        formula: "日数(両端入れ) = (終了日 - 開始日) + 1日",
        description:
          "開始日と終了日の両方を含めて日数を数える方式です。イベント期間やセール開催日数、ホテルの宿泊日程などの表記で一般的に用いられます。",
        example: "5月1日 〜 5月5日 の場合 → 5 - 1 + 1 = 5日間",
      },
      {
        title: "カレンダー日数換算（片端入れ・純差分）",
        formula: "日数(片端入れ) = 終了日 - 開始日",
        description:
          "民法の「初日不算入の原則」や年齢計算、単純な日付の差分を求める際に用いられる方式です。",
        example: "5月1日 〜 5月5日 の場合 → 5 - 1 = 4日間",
      },
    ],
    benchmarkTable: {
      title: "【用途別】「両端入れ」と「片端入れ（初日不算入）」の使い分け基準",
      headers: ["計算方式", "計算ルール", "代表的な利用シーン", "具体例 (5/1〜5/5)"],
      rows: [
        [
          "両端入れ (当日含む)",
          "開始日と終了日の両方を1日としてカウント",
          "ECセール期間（5日間限定）、旅行・宿泊日程（4泊5日）、展示会・イベント開催期間",
          "5日間 (5/1, 5/2, 5/3, 5/4, 5/5)",
        ],
        [
          "片端入れ (初日不算入)",
          "民法の原則。初日をゼロ日目として翌日から数える",
          "クーリングオフ期間（8日間）、契約有効期限、支払い期日（請求日から◯日以内）",
          "4日間 (5/2, 5/3, 5/4, 5/5)",
        ],
        [
          "24時間単位 (実時間)",
          "丸24時間が経過した時点で1日とカウント",
          "レンタルビデオ・レンタカーの24時間料金、Webサーバー・SSL証明書の有効期限",
          "96時間 (丸4日分)",
        ],
      ],
    },
    proTips: [
      {
        title: "セールバナーのキャッチコピーは「◯日間」より「◯時間限定」の方が訴求力が高い",
        description:
          "Webマーケティングでは、「3日間限定」と書くよりも「72時間限定タイムセール」と表記した方が、カウントダウンの切迫感（FOMO: 取り残される恐怖）が生まれ、CVR（購買転換率）が約1.2〜1.5倍向上しやすいというデータがあります。",
      },
      {
        title: "月末締め・翌月末払いの「月日数変動」に注意する",
        description:
          "月をまたぐ期間計算では、28日〜31日と月によって日数が異なるため、固定の日数（例: 30日）でスケジュールを組むとズレが生じます。特に2月の閏年（29日）の有無は厳密にチェックしましょう。",
      },
      {
        title: "タイムゾーン（JST vs UTC）の取り扱い",
        description:
          "海外製ツールやグローバル展開のEC（Shopify等）では、システム時間が世界標準時（UTC）になっている場合があります。日本時間（JST: UTC+9）との時差計算を誤ると、クーポンの失効時間がズレる事故につながるため注意が必要です。",
      },
    ],
    useCases: [
      {
        title: "ECセール告知・カウントダウンバナー制作",
        description:
          "「金曜20:00〜月曜01:59」といった複雑な終了日時の総時間数を計算し、「◯時間限定」表記の確定に。",
      },
      {
        title: "プロジェクトの工数管理・開発スプリント日程計算",
        description:
          "タスクの開始からリリース日までの実稼働時間やカレンダー上の日数を正確に把握。",
      },
      {
        title: "定期購入（サブスクリプション）の次回発送日サイクル設計",
        description:
          "「30日ごと発送」と「1ヶ月ごと発送」での年間お届け回数やズレのシミュレーションに。",
      },
      {
        title: "有給休暇や育児休業の取得期間計算",
        description:
          "開始日と終了日から、土日を含む総取得日数や実経過期間を素早く計算。",
      },
    ],
    faqs: [
      {
        question: "「両端入れ」と「片端入れ」はどちらを使えばよいですか？",
        answer:
          "一般的なイベントやセール、キャンペーン期間の表記には「両端入れ（開始日と終了日の両方を含む）」を使用します。一方、法律上の契約期間や期限の計算には「片端入れ（初日不算入）」を用いるのが通例です。",
      },
      {
        question: "1日は何時間、何分、何秒ですか？",
        answer:
          "1日 ＝ 24時間 ＝ 1,440分 ＝ 86,400秒 です。1週間は 7日 ＝ 168時間 ＝ 10,080分 となります。",
      },
      {
        question: "閏年（うるう年）の判定基準はどうなっていますか？",
        answer:
          "西暦年が4で割り切れる年は閏年（2月が29日・年間366日）です。ただし、100で割り切れて400で割り切れない年は平年となります。当ツールはグレゴリオ暦に完全対応しています。",
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
        benchmarkTable={guideData.benchmarkTable}
        proTips={guideData.proTips}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default TimeSpanCalculator;
