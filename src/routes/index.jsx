import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import TopPage from "../pages/TopPage";
import HolidayCalculator from "../pages/HolidayCalculator";
import GrossProfitCalculator from "../pages/GrossProfitCalculator";
import AspectRatioCalculator from "../pages/AspectRatioCalculator";
import DiscountCalculator from "../pages/DiscountCalculator";
import CharacterCounter from "../pages/CharacterCounter";
import TimeSpanCalculator from "../pages/TimeSpanCalculator";
import QRCodeGenerator from "../pages/QRCodeGenerator";
import WholesalePriceCalculator from "../pages/WholesalePriceCalculator";
import YoutubeEmbedGenerator from "../pages/YoutubeEmbedGenerator";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Contact from "../pages/Contact";
import About from "../pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
        path: "/time-span-calculator",
        element: <TimeSpanCalculator />,
      },
      {
        path: "/qr-code-generator",
        element: <QRCodeGenerator />,
      },
      {
        path: "/wholesale-price-calculator",
        element: <WholesalePriceCalculator />,
      },
      {
        path: "/youtube-embed-generator",
        element: <YoutubeEmbedGenerator />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ]
  }
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
