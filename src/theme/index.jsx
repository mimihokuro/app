import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const customTheme = extendTheme(
  {
    colors: {
      primary: "#0f7b4b", // Notionのクリーンな緑
      secondary: "#196343", // ホバー時の少し濃い緑
      colorGrayDark: "#787774", // NotionのtextLightに近いグレー
      colorGray: "#e9e9e7", // Notionの薄いボーダー色
      colorGrayLight: "#efefed", // Notionのホバー背景
      colorGrayLightest: "#f7f7f5", // Notionのサイドバー背景
      colorWhite: "#ffffff",
    },
    fonts: {
      heading: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      body: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
    components: {
      Input: {
        variants: {
          outline: {
            field: {
              borderColor: "colorGray",
              bg: "transparent",
              borderRadius: "md",
              _hover: {
                borderColor: "colorGrayDark",
              },
              _focus: {
                borderColor: "primary",
                boxShadow: "0 0 0 1px #0f7b4b",
              },
            },
          },
        },
      },
      Textarea: {
        variants: {
          outline: {
            borderColor: "colorGray",
            bg: "transparent",
            borderRadius: "md",
            _hover: {
              borderColor: "colorGrayDark",
            },
            _focus: {
              borderColor: "primary",
              boxShadow: "0 0 0 1px #0f7b4b",
            },
          },
        },
      },
      Select: {
        variants: {
          outline: {
            field: {
              borderColor: "colorGray",
              bg: "transparent",
              borderRadius: "md",
              _hover: {
                borderColor: "colorGrayDark",
              },
              _focus: {
                borderColor: "primary",
                boxShadow: "0 0 0 1px #0f7b4b",
              },
            },
          },
        },
      },
      Button: {
        baseStyle: {
          borderRadius: "md",
          fontWeight: "500",
        },
        variants: {
          solid: {
            bg: "primary",
            color: "white",
            _hover: {
              bg: "secondary",
              _disabled: {
                bg: "primary",
              }
            },
          },
          outline: {
            borderColor: "colorGray",
            _hover: {
              bg: "colorGrayLight",
            },
          },
        },
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "primary",
    components: ["Button", "Badge"],
  })
);

export default customTheme;
