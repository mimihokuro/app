import {
  Stack,
  Text,
  LinkOverlay,
  LinkBox,
  List,
  ListItem,
} from "@chakra-ui/react";

const AppList = [
  {
    title: "TOP",
    url: "/",
  },
  {
    title: "🗓️休日計算ツール",
    url: "/holiday-calculator",
  },
  {
    title: "💸粗利計算ツール",
    url: "/gross-profit-calculator",
  },
  {
    title: "📐アスペクト比計算ツール",
    url: "/aspect-ratio-calculator",
  },
  {
    title: "🧮割引計算ツール",
    url: "/discount-calculator",
  },
  {
    title: "🔡文字数カウントツール",
    url: "/character-counter",
  },
  {
    title: "⏳期間日時計算ツール",
    url: "/time-span-calculator",
  },
  {
    title: "📱QRコード生成ツール",
    url: "/qr-code-generator",
  },
  {
    title: "💸卸価格計算ツール",
    url: "/wholesale-price-calculator",
  },
  {
    title: "▶️YouTube埋め込みジェネレーター",
    url: "/youtube-embed-generator",
  },
];

const Sidebar = () => {
  return (
    <Stack
      as="aside"
      backgroundColor="primary"
      px={8}
      py={10}
      maxW="300"
      width={"100%"}
      top={0}
      borderRadius={8}
      position="sticky"
    >
      <List as="ul" textAlign="left" mb="auto">
        {AppList.map((app) => (
          <ListItem
            w="100%"
            key={app.title}
            color={"#ffffff"}
            borderBlockEnd={"1px solid #ccc"}
            overflow="hidden"
          >
            <LinkBox as="div">
              <LinkOverlay
                href={app.url}
                rel="noopener noreferrer"
                display={"block"}
                px={2}
                py={6}
                fontWeight="bold"
                _hover={{ backgroundColor: "secondary" }}
                transition={"background-color 0.3s ease"}
              >
                <Text size="xs">{app.title}</Text>
              </LinkOverlay>
            </LinkBox>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default Sidebar;
