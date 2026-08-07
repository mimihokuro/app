import {
  Button,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { css } from "@emotion/react";
import MainContentsHeading from "../components/MainContentsHeading";
import { FiCopy } from "react-icons/fi";
import ToolGuideSection from "../components/ToolGuideSection";

function CharacterCounter() {
  usePageMetadata({
    title: "文字数カウントツール | EC Tool Crate",
    description:
      "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。",
    canonicalUrl: "https://ec-tool-crate.com/character-counter",
    ogTitle: "文字数カウントツール | EC Tool Crate",
    ogDescription:
      "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。",
    ogType: "website"
  });

  const [text, setText] = useState("");
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const characterCount = text.length;
  const characterCountWithoutSpaces = text.replace(/\s/g, "").length;

  function isHankaku(char) {
    if (!char || char.length !== 1) {
      return false; // 空文字や複数文字の場合は対象外
    }
    const charCode = char.charCodeAt(0);
    // 改行文字 (LF: Line Feed)
    if (charCode === 0x000a) {
      // \n の文字コード
      return true;
    }
    // ASCII printable characters (space to ~)
    if (charCode >= 0x0020 && charCode <= 0x007e) {
      return true;
    }

    // Half-width Katakana
    if (charCode >= 0xff61 && charCode <= 0xff9f) {
      return true;
    }

    // 他にも半角と見なす文字があればここに追加できます
    // 例: 一部の半角記号など

    return false;
  }

  function calculateSpecialLength(text) {
    let count = 0;
    for (const char of text) {
      // 改行文字の扱い: ここでは改行も1文字（または0.5文字）としてカウントされます。
      // 仕様に応じて、改行を無視するなどの処理を追加できます。
      // 例えば、改行をカウントしない場合:
      // if (char === '\n') continue;

      if (isHankaku(char)) {
        count += 0.5;
      } else {
        count += 1;
      }
    }
    return count;
  }

  // 単語数のカウント（簡易版：スペース区切り）
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // 行数のカウント
  const lineCount = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
  const specialLengthCount = calculateSpecialLength(text);
  const specialLengthCountWithoutSpaces = calculateSpecialLength(
    text.replace(/\s/g, "")
  );

  const RESULT_ITEMS = [
    { value: characterCount, label: "文字数" },
    { value: characterCountWithoutSpaces, label: "文字数（空白除く）" },
    { value: specialLengthCount, label: "全角＝1文字、半角＝0.5文字換算" },
    {
      value: specialLengthCountWithoutSpaces,
      label: "全角＝1文字、半角＝0.5文字換算（空白除く）",
    },
    { value: wordCount, label: "単語数（空白区切り）" },
    { value: lineCount, label: "行数" },
  ];

  const handleCopyInputText = async () => {
    if (!text) {
      toast({
        title: "テキストがありません",
        description: "入力エリアにテキストがありません。",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "コピーしました！",
        description: "入力テキストがクリップボードにコピーされました。",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
    } catch (err) {
      toast({
        title: "コピー失敗",
        description: "クリップボードへのコピーに失敗しました。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      console.error("Failed to copy input text: ", err);
    }
  };

  const handleClearText = () => {
    setText("");
    toast({
      title: "クリアしました",
      description: "入力テキストをクリアしました。",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: toastPosition,
    });
  };

// (CharacterCounter 内)
  const guideData = {
    title: "文字数カウントツール",
    summary:
      "入力した文章の文字数・スペースを除く文字数・バイト数・行数・全角半角換算文字数をリアルタイムで計測する高機能カウンターです。原稿作成、SEO記事の文字数チェック、SNS投稿の制限文字数確認に重宝します。",
    logicSteps: [
      {
        title: "リアルタイム計測",
        description: "テキストエリアに入力された文字列の変化を検知し、即座に各指標をリアルタイム算出します。",
      },
      {
        title: "全角・半角換算カウント",
        description: "全角文字（漢字・ひらがな・カタカナ・全角記号）を1文字、半角英数字・半角カナを0.5文字として正確に計算します。",
      },
    ],
    useCases: [
      {
        title: "ECサイトの商品タイトル・商品説明文の作成",
        description: "楽天市場（全角127文字）、Yahoo!ショッピング、Amazonの規定文字数制限のチェックに。",
      },
      {
        title: "SEO記事・ブログ原稿の文字数推敲",
        description: "指定された文字数（例: 2,000文字以上）に達しているか、余計な空白が含まれていないかをチェック。",
      },
    ],
    faqs: [
      {
        question: "入力した原稿データが外部に送信されたり保存されたりすることはありますか？",
        answer:
          "いいえ、文字数のカウント処理はすべてお客様のブラウザ内で完結しております。入力した文章がサーバーに送信されたり、第三者に閲覧・保存されることは一切ございませんのでご安心ください。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🔡 文字数カウントツール"}
        pageDescription={
          "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。"
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
            size="md"
            minHeight="200px"
            borderColor="colorGray"
            borderRadius={6}
            _hover={{ borderColor: "colorGrayDark" }}
            _focus={{
              borderColor: "primary",
            }}
          />
          <HStack gap={4}>
            <Tooltip label="入力テキストをコピー" placement="top" hasArrow>
              <IconButton
                icon={<FiCopy />}
                size="md"
                backgroundColor={"primary"}
                variant="solid"
                onClick={handleCopyInputText}
                aria-label="入力テキストをコピー"
                isDisabled={!text}
              />
            </Tooltip>
            <Tooltip label="クリア" placement="top" hasArrow>
              <Button
                size="md"
                variant="solid"
                backgroundColor={"primary"}
                onClick={handleClearText}
                isDisabled={!text}
              >
                クリア
              </Button>
            </Tooltip>
          </HStack>
        </Stack>

        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="集計結果" />

          <Stack gap={3}>
            {RESULT_ITEMS.map((item, index) => (
              <HStack
                key={index}
                placeContent={"space-between"}
                gap={8}
                px={4}
                py={2}
                borderRadius={8}
                backgroundColor={"colorGrayLight"}
              >
                <Text as={"span"} fontSize="sm">
                  {item.label}
                </Text>
                <Text
                  as={"span"}
                  display={"flex"}
                  placeItems={"center"}
                  gap={1}
                  whiteSpace={"nowrap"}
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  {item.value}
                  <Text as={"span"} fontSize="sm" fontWeight="bold">
                    文字
                  </Text>
                </Text>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <ToolGuideSection
        title={guideData.title}
        summary={guideData.summary}
        logicSteps={guideData.logicSteps}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default CharacterCounter;
