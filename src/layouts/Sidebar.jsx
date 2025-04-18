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
    url: "/holiday-calculation",
  },
  {
    title: "💸粗利計算ツール",
    url: "/gross-profit-calculation",
  },
];

const Sidebar = () => {
  return (
    <Stack
      as="aside"
      backgroundColor="#0AA864"
      px={8}
      py={10}
      height={"100dvh"}
      maxW="300"
      width={"100%"}
      top={0}
      left={{ base: "-100%", lg: "0" }}
      borderRightRadius={"32px"}
      position={{
        base: "absolute",
        lg: "sticky",
      }}
    >
      <List as="ul" textAlign="left" mb="auto">
        {AppList.map((app) => (
          <ListItem
            w="100%"
            key={app.title}
            px={2}
            py={6}
            color={"#ffffff"}
            borderBlockEnd={"1px solid #ccc"}
            overflow="hidden"
            _hover={{ filter: "brightness(1.5)" }}
            transition="box-shadow 0.2s"
          >
            <LinkBox as="div">
              <LinkOverlay
                href={app.url}
                fontWeight="bold"
                // isExternal
                rel="noopener noreferrer"
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
