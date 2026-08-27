import { useState, useCallback, useRef } from "react";
import SelectDate from "../features/holiday-calculation/SelectDate";
import SelectOptions from "../features/holiday-calculation/SelectOptions";
import DisplayResult from "../features/holiday-calculation/DisplayResult";
import {
  ButtonGroup,
  Flex,
  Grid,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import DisplayHolidaysList from "../features/holiday-calculation/DisplayHolidaysList";
import { css } from "@emotion/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import MainContentsHeading from "../components/MainContentsHeading";
import ExecuteButton from "../components/ExecuteButton";
import ToolGuideSection from "../components/ToolGuideSection";
import useNationalHolidays from "../features/holiday-calculation/hooks/useNationalHolidays";
import useBusinessHolidays from "../features/holiday-calculation/hooks/useBusinessHolidays";
import {
  OPTION_HOLIDAYS,
  OPTION_WEEKDAYS,
} from "../features/holiday-calculation/constants/holidayOptions";

const HolidayCalculator = () => {
  usePageMetadata({
    title: "年間休日計算ツール | EC Tool Crate",
    description:
      "指定の期間中の休日数をカウントするツールです。自分の所属する企業の年間休日を計算したいときやプライベートのスケジュール管理などにお役立てください。曜日を指定すれば、特定の曜日の数も計算できます。",
    canonicalUrl: "https://ec-tool-crate.com/holiday-calculator",
    ogTitle: "年間休日計算ツール | EC Tool Crate",
    ogDescription:
      "指定の期間中の休日数をカウントするツールです。自分の所属する企業の年間休日を計算したいときやプライベートのスケジュール管理などにお役立てください。曜日を指定すれば、特定の曜日の数も計算できます。",
    ogType: "website"
  });

  const today = new Date();
  const [startDate, setStartDate] = useState(`${today.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${today.getFullYear()}-12-31`);
  const [option, setOption] = useState("sundays");
  const [selectedDays, setSelectedDays] = useState([]);

  const [nationalHolidaysInPeriodList, setNationalHolidaysInPeriodList] =
    useState([]);
  const [daysInPeriod, setDaysInPeriod] = useState(0);
  const [numberOfHolidays, setNumberOfHolidays] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartDateInvalid, setIsStartDateInvalid] = useState(false);
  const [isEndDateInvalid, setIsEndDateInvalid] = useState(false);

  const {
    nationalHolidaysData,
    isLoadingHolidays,
    holidayError,
    isDateHoliday,
    getHolidayName,
  } = useNationalHolidays();
  const {
    BUSINESS_HOLIDAYS_CONFIG,
    getTotalBusinessHolidays,
    resetBusinessHolidays,
  } = useBusinessHolidays();

  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const resultRef = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // オプションの切り替え
  const handleOptionChange = (value) => {
    setOption(value);
    if (value !== "weekday-designation") {
      setSelectedDays([]); // 曜日指定を解除
      setNationalHolidaysInPeriodList([]); // 祝日一覧をクリア
    }
  };

  // 曜日オプションの切り替え
  const handleDaySelection = (days) => {
    setSelectedDays(days);
  };

  const validateInputs = useCallback(() => {
    setIsStartDateInvalid(false);
    setIsEndDateInvalid(false);
    let isValid = true;
    let hasInputError = false;

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    if (isNaN(startObj.getTime())) {
      setIsStartDateInvalid(true);
      isValid = false;
      hasInputError = true;
    }
    if (isNaN(endObj.getTime())) {
      setIsEndDateInvalid(true);
      isValid = false;
      hasInputError = true;
    }

    if (hasInputError) {
      toast({
        title: "日付が未入力または不正です",
        description: "開始日と終了日を正しく入力してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      // isValid は既に false
    }
    if (startDate > endDate) {
      toast({
        title: "正しい期間を選択してください",
        description: "開始日は終了日より前である必要があります。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      isValid = false;
    }
    if (option === "weekday_designation" && selectedDays.length === 0) {
      toast({
        title: "曜日が選択されていません",
        description:
          "曜日指定オプションを選択した場合は、集計する曜日を1つ以上選択してください。",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      isValid = false;
    }
    if (holidayError) {
      toast({
        title: "エラー",
        description: holidayError,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      isValid = false;
    }
    return isValid;
  }, [
    startDate,
    endDate,
    option,
    selectedDays,
    toast,
    toastPosition,
    holidayError,
  ]);

  // 計算実行
  const calculateDays = useCallback(() => {
    if (!validateInputs()) {
      setIsLoading(false); // バリデーション失敗時もローディング解除
      return;
    }
    if (isLoadingHolidays || !nationalHolidaysData) {
      toast({
        title: "祝日データ準備中",
        description:
          "祝日データを読み込んでいます。しばらくしてから再度お試しください。",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }

    setIsLoading(true);
    const currentDay = new Date(startDate);
    const finalDay = new Date(endDate);
    setDaysInPeriod((finalDay - currentDay) / (24 * 60 * 60 * 1000) + 1);

    const holidaysInPeriod = [];

    let count = 0;
    const tempDate = new Date(currentDay);

    while (tempDate <= finalDay) {
      const dayOfWeek = tempDate.getDay();
      const isCurrentDayHoliday = isDateHoliday(tempDate);

      if (isCurrentDayHoliday) {
        holidaysInPeriod.push({
          date: tempDate.toISOString().split("T")[0],
          value: getHolidayName(tempDate),
        });
      }

      if (
        (option === "sundays" && dayOfWeek === 0) ||
        (option === "weekends" && (dayOfWeek === 0 || dayOfWeek === 6)) ||
        (option === "holidays" && (isCurrentDayHoliday || dayOfWeek === 0)) ||
        (option === "weekends_holidays" &&
          (isCurrentDayHoliday || dayOfWeek === 0 || dayOfWeek === 6)) ||
        (option === "holidays_only" && isCurrentDayHoliday) ||
        (option === "weekday_designation" &&
          selectedDays.includes(OPTION_WEEKDAYS[dayOfWeek].value))
      ) {
        count++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    count += getTotalBusinessHolidays();
    setNationalHolidaysInPeriodList(holidaysInPeriod);
    setNumberOfHolidays(count);
    setIsLoading(false);
    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
    // スクロール位置を調整
    if (isMobile && resultRef.current) {
      const element = resultRef.current;
      const baseOffset = 20; // 基本のオフセット（ピクセル単位）
      // アプリケーションのヘッダー要素に合わせてセレクタを調整してください
      const headerElement = document.querySelector("header"); // 例: 'header', '#app-header', '.main-header'
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const totalOffset = baseOffset + headerHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - totalOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, [
    validateInputs,
    startDate,
    endDate,
    option,
    selectedDays,
    nationalHolidaysData,
    isLoadingHolidays,
    isDateHoliday,
    getHolidayName,
    getTotalBusinessHolidays,
    toast,
    toastPosition,
    isMobile, // isMobile を依存配列に追加
  ]);

  // 検索条件をリセット
  const resetCalculateDays = () => {
    setStartDate(`${today.getFullYear()}-01-01`);
    setEndDate(`${today.getFullYear()}-12-31`);
    setOption("sundays");
    setSelectedDays([]);
    resetBusinessHolidays();
    setDaysInPeriod(0);
    setNumberOfHolidays(0);
    setNationalHolidaysInPeriodList([]);
    setIsStartDateInvalid(false);
    setIsEndDateInvalid(false);
    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  const dateData = { startDate, setStartDate, endDate, setEndDate };
  const optionData = {
    option,
    selectedDays,
    // BUSINESS_HOLIDAYS_CONFIG は SelectOptions でのみ使用するため、
    // ここで DisplayHolidaysList の表示条件に含める必要はありません。
    // SelectOptions 側で適切に表示制御されている前提です。
    // もし SelectOptions 内の年末年始などの項目もオプションによって表示/非表示を切り替えたい場合は、
    // SelectOptions.jsx 側で option の値に応じた条件分岐を追加する必要があります。
    BUSINESS_HOLIDAYS_CONFIG,
    OPTION_HOLIDAYS,
    OPTION_WEEKDAYS,
    handleOptionChange,
    handleDaySelection,
  };
  const result = { daysInPeriod, numberOfHolidays };

  // 祝日一覧を表示すべきオプションか判定
  const shouldDisplayHolidaysList =
    option === "holidays" ||
    option === "weekends_holidays" ||
    option === "holidays_only";

// (HolidayCalculator Component内部)
  const guideData = {
    title: "年間休日計算ツール",
    summary:
      "指定した期間内の休日数（土曜日・日曜日・祝日、および会社独自の夏季休暇や年末年始などの特別休暇）を即座に集計する高精度な日付計算ツールです。内閣府の国民の祝日データと連動し、振替休日や閏年にも完全対応。EC出荷営業日数の管理、有給消化計画、求人票の年間休日の検証に役立ちます。",
    logicSteps: [
      {
        title: "期間内の日付走査と曜日判定",
        description:
          "指定した開始日から終了日までの全日数をループ処理し、各日付の曜日（日〜土）を正確に判別します。",
      },
      {
        title: "内閣府公式祝日データ（CSV）との突合",
        description:
          "内閣府が公表する日本の祝日データとリアルタイム連動し、「国民の祝日」「振替休日」「国民の休日」を自動判定して二重計上を防ぎます。",
      },
      {
        title: "特別休暇（年末年始・お盆・GW等）の加算",
        description:
          "会社独自の休暇設定（例: 12/29〜1/3の年末年始休み、夏季休暇日数）を合算し、実態に即した年間総休日数を算出します。",
      },
    ],
    benchmarkTable: {
      title: "【年間休日数別】働き方の特徴と労働環境の目安",
      headers: ["年間休日数", "休日の構成パターン", "1ヶ月あたりの平均休日", "労働環境・特徴の目安"],
      rows: [
        [
          "125日以上",
          "完全週休2日（土日）＋祝日＋年末年始＋夏季休暇",
          "約 10.4日 / 月",
          "大手企業・上場企業・外資系に多い高水準。有給休暇を合わせると年間135〜140日以上休める。",
        ],
        [
          "120日前後",
          "完全週休2日（土日）＋祝日（カレンダー通り）",
          "約 10.0日 / 月",
          "日本のカレンダー通りの休日数（土日104日＋祝日約16日）。最も標準的で無理のない労働環境。",
        ],
        [
          "110日 〜 115日",
          "完全週休2日（祝日は一部出勤）または隔週土曜出勤",
          "約 9.1〜9.5日 / 月",
          "中小企業や製造業、EC出荷現場などで一般的。祝日やお盆に交代制で出勤するケースが多い。",
        ],
        [
          "105日",
          "法律上の最低限ライン（週40時間労働基準）",
          "約 8.7日 / 月",
          "労働基準法（1日8時間・週40時間）を満たすギリギリの休日数。月6〜8日休みのシフト制に多い。",
        ],
        [
          "100日未満",
          "週休1日制または変形労働時間制",
          "約 8.0日以下 / 月",
          "繁忙期対応や店舗勤務などに多い。労働基準法違反（36協定超過）がないか注意が必要。",
        ],
      ],
    },
    proTips: [
      {
        title: "ECモールの「あす楽・翌日配送」における休業日設定の注意点",
        description:
          "楽天市場やYahoo!ショッピングでは、店舗営業日カレンダーで休業日に指定していないと、祝日でも即日出荷義務（あす楽対象）が発生してペナルティを受ける場合があります。大型連休（GW・お盆・年末年始）前には必ずカレンダー設定と連動させましょう。",
      },
      {
        title: "「祝日が土曜日と重なった年」は年間の総休日数が減る",
        description:
          "日本の祝日法では、祝日が『日曜日』の場合は翌月曜日が振替休日になりますが、『土曜日』と重なった場合は振替休日がありません。そのため年によって土日祝日の合計日数は118日〜121日の間で変動します。",
      },
      {
        title: "求人票の「週休2日制」と「完全週休2日制」の決定的な違い",
        description:
          "『完全週休2日制』は毎週必ず2日の休みがありますが、『週休2日制』は月に1回以上、週2日休みの週があれば名乗ることができます。年間休日で20日以上の差が出るため、必ず年間総休日数を確認することが大切です。",
      },
    ],
    useCases: [
      {
        title: "転職・就職時の求人票における年間休日の実態検証",
        description:
          "「年間休日120日」と書かれた募集要項に対し、自社の配属部署の休日カレンダーと照合して実態を試算。",
      },
      {
        title: "ECショップの月間稼働日数・出荷リードタイム計画",
        description:
          "土日祝日休みの倉庫で、翌月の実働営業日数を割り出して出荷能力（キャパシティ）を事前に予測。",
      },
      {
        title: "有給休暇の計画的付与・大型連休のシミュレーション",
        description:
          "ゴールデンウィークやシルバーウィークの飛び石連休に有給を充当した場合の最大連続休暇日数を算出。",
      },
      {
        title: "受託開発・業務委託の人月工数・営業日数計算",
        description:
          "プロジェクトの納期見積もりにおいて、祝日を除外した実質稼働人日（実働日数）を算出する際に。",
      },
    ],
    faqs: [
      {
        question: "「年間休日120日」はカレンダー通り休めるということですか？",
        answer:
          "はい。土曜日（52日）＋日曜日（52日）＝104日、さらに国民の祝日（16日）を足すと合計120日になります。そのため年間休日120日は『土日祝日がすべて休み』の標準的な水準です。",
      },
      {
        question: "祝日が土曜日と重なった場合、振替休日は発生しますか？",
        answer:
          "日本の祝日法上、振替休日が発生するのは『祝日が日曜日と重なった場合（翌月曜日が休み）』のみです。土曜日と祝日が重なった場合は振替休日は発生しません。",
      },
      {
        question: "「国民の休日」とは何ですか？",
        answer:
          "祝日法第3条第3項に基づき、『祝日と祝日に挟まれた平日』が自動的に休日となる制度です。例として、敬老の日と秋分の日に挟まれた平日が「国民の休日」となり、シルバーウィークの大型連休が発生します。",
      },
    ],
  };

  return (
    <Stack width="100%" mx="auto">
      <PageTitle
        pageTitle={"🗓️ 休日計算ツール"}
        pageDescription={
          "指定の期間中の休日数をカウントするツールです。所属する企業の年間休日を計算したいときやプライベートのスケジュール管理などにお役立てください。曜日を指定すれば、特定の曜日の数も計算できます。"
        }
      />
      {holidayError && (
        <Text color="red.500" mt={2}>
          祝日データの読み込みに失敗しました: {holidayError}
        </Text>
      )}
      <Text mt={2}>
        ※祝日は{today.getFullYear() - 1}年、{today.getFullYear()}年、
        {today.getFullYear() + 1}年の分が取得できます。
      </Text>
      {isLoadingHolidays && <Text mt={2}>祝日データを読み込み中...</Text>}

      <Stack>
        <Grid
          width={"100%"}
          mt={6}
          gap={8}
          css={css`
            @container parent (min-width: 800px) {
              grid-template-columns: repeat(2, 1fr);
            }

            grid-template-columns: 1fr;
          `}
        >
          <Stack
            gap={4}
            p={6}
            border={"1px solid"}
            borderColor="colorGray"
            borderRadius={8}
          >
            <MainContentsHeading heading="集計日選択" />
            <SelectDate
              dateData={dateData}
              isStartDateInvalid={isStartDateInvalid}
              setIsStartDateInvalid={setIsStartDateInvalid}
              isEndDateInvalid={isEndDateInvalid}
              setIsEndDateInvalid={setIsEndDateInvalid}
            />
            <SelectOptions optionData={optionData} />
            <ButtonGroup
              display={"grid"}
              gridTemplateColumns={"repeat(2, 1fr)"}
              width={"100%"}
              gap={2}
              mt={4}
            >
              <ExecuteButton buttonFunc={calculateDays} text="計算する" />
              <ExecuteButton
                icon={<FiRefreshCw />}
                variant="outline"
                buttonFunc={resetCalculateDays}
                text="リセット"
              />
            </ButtonGroup>
          </Stack>
          <Stack
            ref={resultRef}
            gap={4}
            p={6}
            border={"1px solid"}
            borderColor="colorGray"
            borderRadius={8}
          >
            <MainContentsHeading heading="集計結果" />
            {isLoading ? (
              <Flex placeContent="center" alignItems="center" gap={2} h="100%">
                <FiAlertTriangle />
                <Text>計算中...</Text>
              </Flex>
            ) : (
              <>
                <DisplayResult result={result} />
                {shouldDisplayHolidaysList && (
                  <DisplayHolidaysList
                    nationalHolidaysInPeriodList={nationalHolidaysInPeriodList}
                  />
                )}
              </>
            )}
          </Stack>
        </Grid>
      </Stack>

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
};

export default HolidayCalculator;
