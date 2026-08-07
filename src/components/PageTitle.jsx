import { Heading, Stack, Text, Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

const extractEmojiAndTitle = (fullTitle) => {
  if (!fullTitle) return { emoji: "🛠️", title: "" };
  
  // 先頭の絵文字や記号を抽出する正規表現
  const match = fullTitle.match(/^([^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF00-\uFFEF\u3000-\u303F]+)(.*)$/u);
  
  if (match) {
    return {
      emoji: match[1].trim(),
      title: match[2].trim()
    };
  }
  
  // マッチしなかった場合、既知のプレフィックスからフォールバック判定
  const emojis = ["🗓️", "💸", "📐", "🧮", "🔡", "⏳", "📱", "▶️"];
  for (const e of emojis) {
    if (fullTitle.startsWith(e)) {
      return {
        emoji: e,
        title: fullTitle.replace(e, "").trim()
      };
    }
  }

  return { emoji: "🛠️", title: fullTitle };
};

const PageTitle = ({ pageTitle, pageDescription }) => {
  const { emoji, title } = extractEmojiAndTitle(pageTitle);

  return (
    <Stack gap={4} className="mb-8 text-left select-none font-sans">
      {/* 巨大絵文字アイコン */}
      <Box className="text-6xl mb-2 text-notion-text">
        {emoji}
      </Box>

      {/* タイトル */}
      <Heading
        as="h1"
        fontSize={{ base: "32px", md: "40px" }}
        fontWeight="700"
        color="notion.text"
        lineHeight="1.2"
        className="tracking-tight"
      >
        {title}
      </Heading>

      {/* 説明文 */}
      {pageDescription && (
        <Text 
          fontSize={{ base: "15px", md: "17px" }} 
          color="colorGrayDark" 
          lineHeight="1.5"
          className="mt-1"
        >
          {pageDescription}
        </Text>
      )}

      {/* 境界線 */}
      <Box 
        borderBottom="1px solid"
        borderColor="colorGray"
        pb={4}
        className="mt-3"
      />
    </Stack>
  );
};

PageTitle.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  pageDescription: PropTypes.string,
};

export default PageTitle;
