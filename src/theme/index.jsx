import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    primary: "#0AA864",
    secondary: "#47be8b",
  },
  fonts: {
    heading: `'Noto Sans JP', sans-serif`, // カスタムフォント
    body: `'Roboto', sans-serif`, // カスタムフォント
  },
  // その他のテーマ設定 (breakpoints, shadows など)
});

export default customTheme;
