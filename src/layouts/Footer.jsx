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
    <VStack as="footer" py={8} gap={4}>
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
      <Text as={"small"} fontSize={16}>
        &copy; 2023-{THIS_YEAR} mimihokuro. All Rights Reserved.
      </Text>
    </VStack>
  );
};

export default Footer;
