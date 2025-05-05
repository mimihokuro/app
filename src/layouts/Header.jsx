import {
  Box,
  HStack,
  Icon,
  Link,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import PropTypes from "prop-types";
import { LuInfo, LuSend } from "react-icons/lu";

const LINKS = [
  {
    title: "運営者",
    url: "https://mimihokuro.com/about/",
    icon: LuInfo,
  },
  {
    title: "問い合わせ",
    url: "https://mimihokuro.com/contact/",
    icon: LuSend,
  },
];

const Header = ({ children }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <HStack as="header" p={6} w={"100%"} justifyContent={"space-between"}>
      <Link
        href="/"
        lineHeight={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        gap={2}
        _hover={{ textDecoration: "none" }}
      >
        <Text as={"span"} fontSize={36} color={"#0AA864"} fontWeight={"600"}>
          EC Tool Crate
        </Text>
        <Text as={"span"} fontSize={12} color={"#555555"}>
          ECサイト運営に役立つツールボックス
        </Text>
      </Link>
      <HStack gap={6}>
        {!isMobile &&
          LINKS.map((link) => (
            <Link
              key={link.title}
              variant="underline"
              href={link.url}
              display={"flex"}
              alignItems={"center"}
              gap={0.5}
              _hover={{
                textDecoration: "underline",
                textUnderlineOffset: 6,
                color: "#0AA864",
              }}
            >
              <Icon fontSize={22} color={"#0AA864"}>
                {React.createElement(link.icon)}
              </Icon>
              {link.title}
            </Link>
          ))}
        <Box>{children}</Box>
      </HStack>
    </HStack>
  );
};
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
