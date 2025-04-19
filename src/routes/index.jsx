import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopPage from "../pages/TopPage";
import HolidayCalculation from "../pages/HolidayCalculation";

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
  return <RouterProvider router={router} />;
};
