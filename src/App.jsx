import "./App.css";
import React, { useEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import Ad from "./components/Ad";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const location = useLocation();
  const mainContentRef = useRef(null);

  // ページ遷移時にモバイル用サイドバーを閉じ、スクロール位置を上部にリセットする
  useEffect(() => {
    if (isMobile) {
      onClose();
    }
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname, isMobile, onClose]);

  return (
    <Box className="min-h-screen bg-[#f3f3f1] py-0 md:py-4 px-0 md:px-4 flex items-center justify-center font-sans">
      <Box className="flex h-screen md:h-[calc(100vh-2rem)] w-full max-w-7xl bg-white rounded-none md:rounded-2xl shadow-none md:shadow-2xl overflow-hidden border-0 md:border border-notion-border relative">
        
        {/* Desktop Sidebar (Left side, sticky) */}
        {!isMobile && (
          <Box className="h-full flex-shrink-0">
            <Sidebar />
          </Box>
        )}

        {/* Main Content Area (Right side, scrollable) */}
        <Box className="flex-1 flex flex-col h-full overflow-hidden bg-white min-w-0">
          <Header onOpen={onOpen} />
          
          <Box 
            ref={mainContentRef} 
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col min-w-0"
          >
            <Box 
              className="flex-1 min-w-0"
              sx={{
                containerType: "inline-size",
                containerName: "parent",
              }}
            >
              <Outlet />
            </Box>
            {/* <Box className="mt-8">
              <Ad />
            </Box> */}
            <Footer />
          </Box>
        </Box>

        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent maxW="256px">
              <DrawerCloseButton
                color="gray.500"
                fontSize="14px"
                top="12px"
                right="12px"
                zIndex="20"
              />
              <DrawerBody p={0} className="bg-notion-sidebar">
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
      </Box>
    </Box>
  );
}

export default App;
