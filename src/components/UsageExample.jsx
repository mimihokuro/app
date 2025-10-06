import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

const UsageExample = ({ example }) => {
  return (
    <>
      <Divider borderColor={"colorGray"} />
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md">
          <Icon as={InfoIcon} mr={2} color="primary" />
          {example.title}
        </Heading>
        <Box
          p={{ base: 5, md: 8 }}
          borderRadius="xl"
          border="1px"
          borderColor={"colorGray"}
        >
          <VStack spacing={4} align="stretch">
            <Text>{example.scenario}</Text>
            <Box bg={"colorGrayLight"} p={4} borderRadius="md">
              {example.inputs.map((input, index) => (
                <Text key={index} fontFamily="monospace">
                  ・{input.label}:{" "}
                  <Text as="span" fontWeight="bold">
                    {input.value}
                  </Text>{" "}
                  {input.unit}
                </Text>
              ))}
            </Box>
            <Text fontWeight="bold" fontSize="lg">
              {example.resultDescription}
            </Text>
            <Box
              bg="blue.50"
              _dark={{ bg: "blue.900" }}
              p={4}
              borderRadius="md"
            >
              <HStack spacing={4}>
                <Icon as={CheckCircleIcon} color="green.500" w={5} h={5} />
                <Text fontFamily="monospace" fontSize="md">
                  {example.result}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </>
  );
};

UsageExample.propTypes = {
  example: PropTypes.shape({
    title: PropTypes.string.isRequired,
    scenario: PropTypes.string.isRequired,
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        unit: PropTypes.string,
      })
    ).isRequired,
    resultDescription: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
  }).isRequired,
};

export default UsageExample;
