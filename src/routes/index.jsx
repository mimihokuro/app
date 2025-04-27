import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopPage from "../pages/TopPage";
import HolidayCalculation from "../pages/HolidayCalculation";
import GrossProfitCalculation from "../pages/GrossProfitCalculation";
import { Stack } from "@chakra-ui/react";

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
]);

export const Routes = () => {
  return (
    <Stack
      width={"100%"}
      backgroundColor={"#ffffff"}
      borderLeftRadius={{
        base: "0px",
        lg: "32px",
      }}
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
