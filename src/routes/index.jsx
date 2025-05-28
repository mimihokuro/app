import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopPage from "../pages/TopPage";
import HolidayCalculator from "../pages/HolidayCalculator";
import GrossProfitCalculator from "../pages/GrossProfitCalculator";
import { Stack } from "@chakra-ui/react";
import AspectRatioCalculator from "../pages/AspectRatioCalculator";
import DiscountCalculator from "../pages/DiscountCalculator";
import CharacterCounter from "../pages/CharacterCounter";
import DateTimeCalculator from "../pages/DateTimeCalculator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TopPage />,
  },
  {
    path: "/holiday-calculator",
    element: <HolidayCalculator />,
  },
  {
    path: "/gross-profit-calculator",
    element: <GrossProfitCalculator />,
  },
  {
    path: "/aspect-ratio-calculator",
    element: <AspectRatioCalculator />,
  },
  {
    path: "/discount-calculator",
    element: <DiscountCalculator />,
  },
  {
    path: "/character-counter",
    element: <CharacterCounter />,
  },
  {
    path: "/date-time-calculator",
    element: <DateTimeCalculator />,
  },
]);

export const Routes = () => {
  return (
    <Stack
      width={"100%"}
      backgroundColor={"#ffffff"}
      borderRadius={8}
      overflow={"hidden"}
      sx={{
        containerType: "inline-size",
        containerName: "parent",
      }}
    >
      <RouterProvider router={router} />;
    </Stack>
  );
};
