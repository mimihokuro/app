import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopPage from "../pages/TopPage";
import HolidayCalculation from "../pages/HolidayCalculation";
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
    element: <HolidayCalculation />,
  },
]);

export const Routes = () => {
  return (
    <Stack
      width={"100%"}
      p={{
        base: 4,
        md: "10",
      }}
      backgroundColor={"#ffffff"}
      borderLeftRadius={{
        base: "0px",
        sm: "0px",
        md: "32px",
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
