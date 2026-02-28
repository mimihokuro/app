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
    canonicalUrl: "https://app.mimihokuro.com/holiday-calculator",
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

  return (
    <Stack width="100%" mx="auto">
      <PageTitle
        pageTitle={"🗓️休日計算ツール"}
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
    </Stack>
  );
};

export default HolidayCalculator;
