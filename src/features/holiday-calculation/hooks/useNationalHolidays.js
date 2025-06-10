import { useState, useEffect, useCallback } from "react";

const useNationalHolidays = () => {
  const [nationalHolidaysData, setNationalHolidaysData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidayData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://holidays-jp.github.io/api/v1/date.json"
        );
        if (!response.ok) {
          throw new Error("祝日データの取得に失敗しました。");
        }
        const json = await response.json();
        setNationalHolidaysData(json);
        setError(null);
      } catch (e) {
        setError(e.message);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHolidayData();
  }, []);

  const isDateHoliday = useCallback(
    (date) => {
      if (!nationalHolidaysData) return false;
      const dateString = date.toISOString().split("T")[0];
      return nationalHolidaysData[dateString] !== undefined;
    },
    [nationalHolidaysData]
  );

  const getHolidayName = useCallback(
    (date) => {
      if (!nationalHolidaysData) return undefined;
      const dateString = date.toISOString().split("T")[0];
      return nationalHolidaysData[dateString];
    },
    [nationalHolidaysData]
  );

  return {
    nationalHolidaysData,
    isLoadingHolidays: isLoading,
    holidayError: error,
    isDateHoliday,
    getHolidayName,
  };
};

export default useNationalHolidays;
