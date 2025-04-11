import "./App.css";
import {
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <Stack
      height="100vh"
      placeContent="space-between"
      boxSizing="border-box"
      w={"100vw"}
    >
      <Header />
      <Text as="h1" fontSize={{ base: "32px", sm: "40px" }}>
        🔧ECサイト運営に役立つツールボックス
      </Text>
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
        gap={4}
        my={8}
        mb="auto"
      >
        <GridItem w="100%" bg="gray.100" borderRadius={8}>
          <LinkBox as="div" p="8">
            <LinkOverlay
              href="https://app.mimihokuro.com/holiday-calculation/"
              fontWeight="bold"
            >
              <Heading size="md">🗓️休日計算ツール</Heading>
            </LinkOverlay>
            <Text mt={4}>
              指定期間内の日数計算を簡単に行えるツールです。土日祝や祝日のみ、指定曜日での集計など複数のオプションをご用意しています。
            </Text>
          </LinkBox>
        </GridItem>
        <GridItem w="100%" bg="gray.100" borderRadius={8}>
          <LinkBox as="div" p="8">
            <LinkOverlay
              href="https://app.mimihokuro.com/gross-profit-calculation/"
              fontWeight="bold"
            >
              <Heading size="md">💸粗利計算ツール</Heading>
            </LinkOverlay>
            <Text mt={4}>
              粗利益（粗利率）、売価／売上、原価を計算するときに便利な計算ツールです。
            </Text>
          </LinkBox>
        </GridItem>
      </Grid>
      <Footer />
    </Stack>
  );
}

export default App;
