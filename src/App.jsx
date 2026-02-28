import "./App.css";

import { Routes } from "./routes/index.jsx";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Grid,
  GridItem,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import { FiMenu } from "react-icons/fi";

function App() {
  // サイドバーの表示/非表示の状態管理
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 現在のブレイクポイントによってサイドバーの表示方法を変更
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Stack
      width={"100%"}
      maxWidth={"1280px"}
      mx={"auto"}
      minHeight={"100vh"}
      gap={8}
      px={{
        base: 0,
        xl: 8,
      }}
    >
      <Header>
        {isMobile && (
          <IconButton
            aria-label="メニューを開く"
            icon={<FiMenu />}
            color={"#444444"}
            onClick={onOpen}
            fontSize={32}
            display={{ base: "flex", lg: "none" }}
          />
        )}
      </Header>
      <Grid
        as="main"
        gap={10}
        templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 300px" }}
        alignItems={"start"}
        height={"100%"}
        px={{
          base: 4,
          xl: "0",
        }}
      >
        <GridItem minW={0} w="full">
          <Routes />
        </GridItem>
        {!isMobile && (
          <GridItem w="full">
            <Sidebar />
          </GridItem>
        )}
        {isMobile && (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton
                color={"#ffffff"}
                fontSize={24}
                top={6}
                right={6}
              />
              <DrawerBody p={0} pr={14} backgroundColor="primary">
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
      </Grid>
      <Footer />
    </Stack>
  );
}

export default App;
