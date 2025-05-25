import { Box, Grid, Stack, Text, Textarea } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { css } from "@emotion/react";
import MainContentsHeading from "../components/MainContentsHeading";

function CharacterCounter() {
  usePageMetadata({
    title: "文字数カウントツール | EC Tool Crate",
    description: "文字数カウントツールです。",
  });

  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const characterCount = text.length;
  // 全角・半角を区別せずにカウントする場合は .length で良い
  // より厳密なカウント（例：サロゲートペアを1文字とする）が必要な場合は、
  // [...text].length や grapheme-splitter などのライブラリを検討してください。

  // 単語数のカウント（簡易版：スペース区切り）
  // const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // 行数のカウント
  const lineCount = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;

  const RESULT_ITEMS = [
    { value: characterCount, label: "文字数" },
    // { value: wordCount, label: "単語数" },
    { value: lineCount, label: "行数" },
  ];

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🔡文字数カウントツール"}
        pageDescription={
          "文字数カウントツールです。テキストを入力すると、リアルタイムで文字数や行数をカウントします。"
        }
      />

      <Grid
        alignItems="start"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={8}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
          }

          grid-template-columns: 1fr;
        `}
      >
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="文字入力" />
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="ここにテキストを入力してください..."
            size="lg"
            minHeight="200px"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{
              borderColor: "brand.700",
            }}
          />
        </Stack>

        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="集計結果" />

          <Grid gridTemplateColumns={"repeat(3, 1fr)"} gap={4}>
            {RESULT_ITEMS.map((item, index) => (
              <Box
                key={index}
                textAlign="center"
                p={4}
                borderWidth="1px"
                borderRadius={8}
                minWidth="80px"
                backgroundColor={"colorGrayLight"}
              >
                <Text fontSize="sm">{item.label}</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {item.value}
                </Text>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Grid>
    </Stack>
  );
}

export default CharacterCounter;
