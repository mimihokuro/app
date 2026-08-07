import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme/index.jsx";
import { Routes } from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={customTheme}>
      <Routes />
    </ChakraProvider>
  </StrictMode>
);
