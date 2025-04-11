import { Stack, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Stack as="footer" backgroundColor="#444444" py={8}>
      <Text fontSize={16} color="white">
        &copy; mimihokuro
      </Text>
    </Stack>
  );
};

export default Footer;
