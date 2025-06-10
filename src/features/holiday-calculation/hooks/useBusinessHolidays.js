import { useState } from "react";

const useBusinessHolidays = () => {
  const [newYearHolidays, setNewYearHolidays] = useState(0);
  const [GWHolidays, setGWHolidays] = useState(0);
  const [summerHolidays, setSummerHolidays] = useState(0);
  const [otherHolidays, setOtherHolidays] = useState(0);

  const countNewYearHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) setNewYearHolidays(valueAsNumber);
  };
  const countGWHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) setGWHolidays(valueAsNumber);
  };
  const countSummerHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) setSummerHolidays(valueAsNumber);
  };
  const countOtherHolidays = (valueAsString, valueAsNumber) => {
    if (valueAsNumber >= 0) setOtherHolidays(valueAsNumber);
  };

  const BUSINESS_HOLIDAYS_CONFIG = [
    {
      title: "年末年始休暇",
      value: newYearHolidays,
      setter: countNewYearHolidays,
    },
    { title: "GW休暇", value: GWHolidays, setter: countGWHolidays },
    { title: "夏季休暇", value: summerHolidays, setter: countSummerHolidays },
    { title: "その他休日", value: otherHolidays, setter: countOtherHolidays },
  ];

  const getTotalBusinessHolidays = () => {
    return newYearHolidays + GWHolidays + summerHolidays + otherHolidays;
  };

  const resetBusinessHolidays = () => {
    setNewYearHolidays(0);
    setGWHolidays(0);
    setSummerHolidays(0);
    setOtherHolidays(0);
  };

  return {
    BUSINESS_HOLIDAYS_CONFIG,
    getTotalBusinessHolidays,
    resetBusinessHolidays,
  };
};

export default useBusinessHolidays;
