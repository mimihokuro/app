import { useEffect, useState } from "react";
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
import { RepeatIcon, WarningIcon } from "@chakra-ui/icons";
import DisplayHolidaysList from "../features/holiday-calculation/DisplayHolidaysList";
import { css } from "@emotion/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import MainContentsHeading from "../components/MainContentsHeading";
import ExecuteButton from "../components/ExecuteButton";

const HolidayCalculator = () => {
  usePageMetadata({
    title: "休日計算ツール | EC Tool Crate",
    description:
      "指定の期間中の休日数をカウントするツールです。曜日を指定すれば、特定の曜日の数も計算できます。自分の所属する企業の年間休日が知りたいときやプライベートのスケジュール管理などにお役立てください。",
  });

  const today = new Date();
  const [startDate, setStartDate] = useState(`${today.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${today.getFullYear()}-12-31`);
  const [option, setOption] = useState("sundays");
  const [selectedDays, setSelectedDays] = useState([]);
  const [nationalHolidaysList, setNationalHolidaysList] = useState(null);
  const [nationalHolidaysInPeriodList, setNationalHolidaysInPeriodList] =
    useState([]);
  const [daysInPeriod, setDaysInPeriod] = useState(0);
  const [numberOfHolidays, setNumberOfHolidays] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartDateInvalid, setIsStartDateInvalid] = useState(false);
  const [isEndDateInvalid, setIsEndDateInvalid] = useState(false);

  const [newYearHolidays, setNewYearHolidays] = useState(0);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const countNewYearHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) {
      setNewYearHolidays(valueAsNumber);
    }
  };

  const [GWHolidays, setGWHolidays] = useState(0);
  const countGWHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) {
      setGWHolidays(valueAsNumber);
    }
  };

  const [summerHolidays, setSummerHolidays] = useState(0);
  const countSummerHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) {
      setSummerHolidays(valueAsNumber);
    }
  };

  const [otherHolidays, setOtherHolidays] = useState(0);
  const countOtherHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) {
      setOtherHolidays(valueAsNumber);
    }
  };

  const BUSINESS_HOLIDAYS = [
    {
      title: "年末年始休暇",
      value: newYearHolidays,
      doing: countNewYearHolidays,
    },
    {
      title: "GW休暇",
      value: GWHolidays,
      doing: countGWHolidays,
    },
    {
      title: "夏季休暇",
      value: summerHolidays,
      doing: countSummerHolidays,
    },
    {
      title: "その他休日",
      value: otherHolidays,
      doing: countOtherHolidays,
    },
  ];

  const OPTION_HOLIDAYS = [
    {
      title: "日曜のみ",
      value: "sundays",
    },
    {
      title: "土日",
      value: "weekends",
    },
    {
      title: "日曜祝日",
      value: "holidays",
    },
    {
      title: "土日祝日",
      value: "weekends_holidays",
    },
    {
      title: "祝日のみ",
      value: "holidays_only",
    },
    {
      title: "曜日指定",
      value: "weekday_designation",
    },
  ];
  const OPTION_WEEKDAYS = [
    { value: "Sunday", title: "日曜" },
    { value: "Monday", title: "月曜" },
    { value: "Tuesday", title: "火曜" },
    { value: "Wednesday", title: "水曜" },
    { value: "Thursday", title: "木曜" },
    { value: "Friday", title: "金曜" },
    { value: "Saturday", title: "土曜" },
  ];

  // マウント時に祝日一覧を取得
  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const response = await fetch(
          "https://holidays-jp.github.io/api/v1/date.json"
        );
        if (!response.ok) {
          throw new Error("Error");
        }
        const json = await response.json();
        setNationalHolidaysList(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHolidayData();
  });

  // 指定の日付が祝日かどうか判定
  const isHoliday = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const holidayName = nationalHolidaysList[dateString];

    if (holidayName !== undefined) {
      setNationalHolidaysInPeriodList((list) => [
        ...list,
        { date: dateString, value: holidayName },
      ]);
    }
    return Object.keys(nationalHolidaysList).includes(dateString);
  };

  // オプションの切り替え
  const handleOptionChange = (value) => {
    setOption(value);
    if (value !== "weekday-designation") {
      setSelectedDays([]); // 曜日指定を解除
    }
  };

  // 曜日オプションの切り替え
  const handleDaySelection = (days) => {
    setSelectedDays(days);
  };

  // 計算実行
  const calculateDays = () => {
    // バリデーション前にエラー状態をリセット
    setIsStartDateInvalid(false);
    setIsEndDateInvalid(false);

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    let hasInputError = false;

    if (isNaN(startObj.getTime())) {
      setIsStartDateInvalid(true);
      hasInputError = true;
    }
    if (isNaN(endObj.getTime())) {
      setIsEndDateInvalid(true);
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
      setIsLoading(false);
      return;
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
      return;
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
      return;
    }

    setIsLoading(true);
    let currentDay = new Date(startDate); // ループ用の日付オブジェクト
    let finalDay = new Date(endDate); // ループ用の日付オブジェクト
    setDaysInPeriod((finalDay - currentDay) / (24 * 60 * 60 * 1000) + 1);
    setNationalHolidaysInPeriodList([]);

    let count = 0;

    while (currentDay <= finalDay) {
      const dayOfWeek = currentDay.getDay();

      if (option === "sundays" && dayOfWeek === 0) {
        count++;
      } else if (
        option === "weekends" &&
        (dayOfWeek === 0 || dayOfWeek === 6)
      ) {
        count++;
      } else if (
        option === "holidays" &&
        (isHoliday(currentDay) || dayOfWeek === 0)
      ) {
        count++;
      } else if (
        option === "weekends_holidays" &&
        (isHoliday(currentDay) || dayOfWeek === 0 || dayOfWeek === 6)
      ) {
        count++;
      } else if (option === "holidays_only" && isHoliday(currentDay)) {
        count++;
      } else if (option === "weekday_designation") {
        if (selectedDays.includes("Sunday") && dayOfWeek === 0) {
          count++;
        } else if (selectedDays.includes("Monday") && dayOfWeek === 1) {
          count++;
        } else if (selectedDays.includes("Tuesday") && dayOfWeek === 2) {
          count++;
        } else if (selectedDays.includes("Wednesday") && dayOfWeek === 3) {
          count++;
        } else if (selectedDays.includes("Thursday") && dayOfWeek === 4) {
          count++;
        } else if (selectedDays.includes("Friday") && dayOfWeek === 5) {
          count++;
        } else if (selectedDays.includes("Saturday") && dayOfWeek === 6) {
          count++;
        }
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    count +=
      Number(newYearHolidays) +
      Number(GWHolidays) +
      Number(summerHolidays) +
      Number(otherHolidays);

    setNumberOfHolidays(count);
    setIsLoading(false);
    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  // 検索条件をリセット
  const resetCalculateDays = () => {
    setStartDate(`${today.getFullYear()}-01-01`);
    setEndDate(`${today.getFullYear()}-12-31`);
    setOption("sundays");
    setNewYearHolidays(0);
    setGWHolidays(0);
    setSummerHolidays(0);
    setOtherHolidays(0);
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
    BUSINESS_HOLIDAYS,
    OPTION_HOLIDAYS,
    OPTION_WEEKDAYS,
    handleOptionChange,
    handleDaySelection,
  };
  const result = { daysInPeriod, numberOfHolidays };

  return (
    <Stack width="100%" mx="auto">
      <PageTitle
        pageTitle={"🗓️休日計算ツール"}
        pageDescription={
          "指定の期間内の休日数を計算するツールです。曜日を指定すれば、特定の曜日の数も計算できます。"
        }
      />
      <Text mt={2}>
        ※祝日は{today.getFullYear() - 1}年、{today.getFullYear()}年、
        {today.getFullYear() + 1}年の分が取得できます。
      </Text>
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
                icon={<RepeatIcon />}
                variant="outline"
                buttonFunc={resetCalculateDays}
                text="リセット"
              />
            </ButtonGroup>
          </Stack>
          <Stack
            gap={4}
            p={6}
            border={"1px solid"}
            borderColor="colorGray"
            borderRadius={8}
          >
            <MainContentsHeading heading="集計結果" />
            {isLoading ? (
              <Flex placeContent="center" placeItems="center" gap={2} h="100%">
                <WarningIcon />
                <Text>計算中...</Text>
              </Flex>
            ) : (
              <>
                <DisplayResult result={result} />
                <DisplayHolidaysList
                  nationalHolidaysInPeriodList={nationalHolidaysInPeriodList}
                />
              </>
            )}
          </Stack>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default HolidayCalculator;
