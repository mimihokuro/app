import { Link, Stack, Text } from "@chakra-ui/react";

const THIS_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <Stack as="footer" py={8} gap={4}>
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
      <Text as={"small"} fontSize={16}>
        &copy; 2023-{THIS_YEAR} mimihokuro. All Rights Reserved.
      </Text>
    </Stack>
  );
};

export default Footer;
