import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const customTheme = extendTheme(
  {
    colors: {
      // primary: "#0AA864",
      primary: "#09975a",
      secondary: "#47be8b",
      colorGray: "#cccccc",
      colorGrayLight: "#f0f0f0",
      colorGrayLightest: "#F3F3F3",
      colorWhite: "#fefefe",
    },
    fonts: {
      // heading: `'Noto Sans JP', sans-serif`, // カスタムフォント
      body: `'Montserrat', sans-serif`, // カスタムフォント
    },
    // その他のテーマ設定 (breakpoints, shadows など)
  },
  withDefaultColorScheme({
    colorScheme: "primary",
    components: ["Button", "Badge"],
  })
);

export default customTheme;
