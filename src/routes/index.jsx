import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopPage from "../pages/TopPage";
import HolidayCalculation from "../pages/HolidayCalculation";
import GrossProfitCalculation from "../pages/GrossProfitCalculation";
import { Stack } from "@chakra-ui/react";
import AspectRatioCalculation from "../pages/AspectRatioCalculation";
import DiscountCalculator from "../pages/DiscountCalculator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TopPage />,
  },
  {
    path: "/holiday-calculation",
    element: <HolidayCalculation />,
  },
  {
    path: "/gross-profit-calculation",
    element: <GrossProfitCalculation />,
  },
  {
    path: "/aspect-ratio-calculation",
    element: <AspectRatioCalculation />,
  },
  {
    path: "/discount-calculator",
    element: <DiscountCalculator />,
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
