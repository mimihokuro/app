import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

// ステップ表示のための孫コンポーネント (これは変更なし)
const FeatureStep = ({ step, title, children }) => {
  return (
    <HStack spacing={4} align="flex-start" w="100%">
      <Flex
        alignItems="center"
        justifyContent="center"
        w={8}
        h={8}
        bg={useColorModeValue("primary", "primary")}
        color="white"
        fontWeight="bold"
        rounded="full"
        flexShrink={0}
      >
        {step}
      </Flex>
      <VStack align="flex-start" spacing={1}>
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text color={useColorModeValue("gray.600", "gray.400")}>
          {children}
        </Text>
      </VStack>
    </HStack>
  );
};

FeatureStep.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// 説明とステップの本体コンポーネント
const UsageSteps = ({ toolName, description, steps }) => {
  return (
    <>
      {/* === セクションタイトル === */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          {toolName}の使い方
        </Heading>
        <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
          {description}
        </Text>
      </Box>

      {/* === ステップ説明 (動的に生成) === */}
      <VStack spacing={8} align="stretch">
        {steps.map((step, index) => (
          <FeatureStep key={index} step={index + 1} title={step.title}>
            {step.description}
          </FeatureStep>
        ))}
      </VStack>
    </>
  );
};

UsageSteps.propTypes = {
  toolName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UsageSteps;
