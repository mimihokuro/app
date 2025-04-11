import { HStack, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <HStack
      as="header"
      backgroundColor={"#444444"}
      p={8}
      w={"100%"}
      justifyContent={"space-between"}
    >
      <Text fontSize={16} textAlign="center" color="white" py={2}>
        EC Tool Crate
      </Text>
      <HStack>
        <Text color="#ffffff">運営者</Text>
        <Text color="#ffffff">運営者</Text>
      </HStack>
    </HStack>
  );
};

export default Header;
