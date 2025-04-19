import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import { Routes } from "./routes/index.jsx";
import { HStack, Stack } from "@chakra-ui/react";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <Stack width={"100%"} backgroundColor={"#F3F3F3"} gap={0}>
        <Header />
        <HStack gap={10} as="main" placeItems={"start"} height={"100%"}>
          <Sidebar />
          <Routes />
        </HStack>
        <Footer />
      </Stack>
    </ChakraProvider>
  </StrictMode>
);
