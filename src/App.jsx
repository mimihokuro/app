import "./App.css";
import { HStack, Stack } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainColumn from "./components/MainColumn";

function App() {
  return (
    <Stack width={"100%"} backgroundColor={"#F3F3F3"} gap={0}>
      <Header />
      <HStack gap={10} as="main" placeItems={"start"} height={"100%"}>
        <Sidebar />
        <MainColumn />
      </HStack>
      <Footer />
    </Stack>
  );
}

export default App;
