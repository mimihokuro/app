import { HStack, Link, Text, VStack } from "@chakra-ui/react";

const THIS_YEAR = new Date().getFullYear();

const LINKS = [
  {
    title: "運営者",
    url: "https://mimihokuro.com/about/",
  },
  {
    title: "問い合わせ",
    url: "https://mimihokuro.com/contact/",
  },
];

const Footer = () => {
  return (
    <VStack as="footer" px={6} py={8} gap={4} mt={"auto"} textAlign={"center"}>
      <Link
        href="https://app.mimihokuro.com/"
        _hover={{ textDecoration: "none" }}
        fontSize={26}
        fontWeight={600}
        color={"#0AA864"}
        lineHeight={1}
      >
        EC Tool Crate
      </Link>
      <HStack gap={6}>
        {LINKS.map((link) => (
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
            {link.title}
          </Link>
        ))}
      </HStack>
      <HStack
        as={"small"}
        fontSize={16}
        flexWrap={"wrap"}
        gap={2}
        justifyContent={"center"}
      >
        <Text>&copy; 2023-{THIS_YEAR} mimihokuro.</Text>{" "}
        <Text>All Rights Reserved.</Text>
      </HStack>
    </VStack>
  );
};

export default Footer;
