import { useEffect, useState } from "react";
import SelectDate from "../features/holiday-calculation/SelectDate";
import SelectOptions from "../features/holiday-calculation/SelectOptions";
import ExecuteButton from "../features/holiday-calculation/ExecuteButton";
import DisplayResult from "../features/holiday-calculation/DisplayResult";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import DisplayHolidaysList from "../features/holiday-calculation/DisplayHolidaysList";
import { css } from "@emotion/react";
import usePageMetadata from "../hooks/usePageMetadata";

const HolidayCalculation = () => {
  usePageMetadata({
    title: "休日計算ツール | EC Tool Crate",
    description:
      "指定の期間中の休日数をカウントするツールです。自分の所属する企業の年間休日が知りたいときやプライベートのスケジュールなどに役立ててください。",
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

  const [newYearHolidays, setNewYearHolidays] = useState(0);
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
    if (startDate <= endDate) {
      setIsLoading(true);
      let start = new Date(startDate);
      let end = new Date(endDate);
      setDaysInPeriod((end - start) / (24 * 60 * 60 * 1000) + 1);
      setNationalHolidaysInPeriodList([]);

      let count = 0;

      while (start <= end) {
        const dayOfWeek = start.getDay();

        if (option === "sundays" && dayOfWeek === 0) {
          count++;
        } else if (
          option === "weekends" &&
          (dayOfWeek === 0 || dayOfWeek === 6)
        ) {
          count++;
        } else if (
          option === "holidays" &&
          (isHoliday(start) || dayOfWeek === 0)
        ) {
          count++;
        } else if (
          option === "weekends_holidays" &&
          (isHoliday(start) || dayOfWeek === 0 || dayOfWeek === 6)
        ) {
          count++;
        } else if (option === "holidays_only" && isHoliday(start)) {
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

        start.setDate(start.getDate() + 1);
      }

      count +=
        Number(newYearHolidays) +
        Number(GWHolidays) +
        Number(summerHolidays) +
        Number(otherHolidays);

      setNumberOfHolidays(count);
      setIsLoading(false);
    }
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
  const buttonFunc = { calculateDays, resetCalculateDays };
  const result = { daysInPeriod, numberOfHolidays };

  return (
    <Stack width="100%" mx="auto">
      <Heading
        as="h1"
        size="lg"
        fontWeight="normal"
        noOfLines={1}
        borderBottom="1px"
        py={2}
        borderBottomColor="#dddddd"
      >
        🗓️休日計算ツール
      </Heading>
      <Text mt={2}>指定の期間内の休日数を計算するツールです。</Text>
      <Text mt={2}>
        ※祝日は{today.getFullYear() - 1}年、{today.getFullYear()}年、
        {today.getFullYear() + 1}年の分が取得できます。
      </Text>
      <Flex
        display="flex"
        justifyContent="center"
        width={"100%"}
        mt={6}
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
        border={"1px solid #eeeeee"}
        borderRadius={8}
        css={css`
          @container parent (min-width: 800px) {
            flex-direction: row;
            gap: 0;
          }

          flex-direction: column;
          gap: 5rem;
        `}
      >
        <Stack
          py={4}
          css={css`
            @container parent (min-width: 800px) {
              width: 50%;
              padding-right: 2rem;
              margin-right: 2rem;
              border-right: 1px solid #dddddd;
            }

            width: 100%;
          `}
        >
          <SelectDate dateData={dateData} />
          <SelectOptions optionData={optionData} />
          <ExecuteButton buttonFunc={buttonFunc} />
        </Stack>
        <Stack
          bg="white"
          py={4}
          borderRadius={8}
          css={css`
            @container parent (min-width: 800px) {
              width: 50%;
            }

            width: 100%;
          `}
        >
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
      </Flex>
    </Stack>
  );
};

export default HolidayCalculation;
