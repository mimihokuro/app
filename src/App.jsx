import "./App.css";

import { Routes } from "./routes/index.jsx";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import { HamburgerIcon } from "@chakra-ui/icons";

function App() {
  // サイドバーの表示/非表示の状態管理
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 現在のブレイクポイントによってサイドバーの表示方法を変更
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Stack width={"100%"} backgroundColor={"#F3F3F3"} gap={0}>
      <Header>
        {isMobile && (
          <IconButton
            aria-label="メニューを開く"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            display={{ base: "flex", lg: "none" }}
          />
        )}
      </Header>
      <HStack gap={10} as="main" placeItems={"start"} height={"100%"}>
        {!isMobile && <Sidebar display="none" />}
        {isMobile && (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton color={"#ffffff"} />
              <DrawerBody p={0} pr={14} backgroundColor="primary">
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
        <Routes />
      </HStack>
      <Footer />
    </Stack>
  );
}

export default App;
