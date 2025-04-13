import { HStack, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <HStack as="header" p={6} w={"100%"} justifyContent={"space-between"}>
      <Text
        fontSize={32}
        color={"#0AA864"}
        fontWeight={"600"}
        textAlign="center"
        py={2}
      >
        EC Tool Crate
      </Text>
      <HStack>
        <Text>運営者</Text>
        <Text>運営者</Text>
      </HStack>
    </HStack>
  );
};

export default Header;
