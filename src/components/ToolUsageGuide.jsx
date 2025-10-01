import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";

// ステップごとの説明コンポーネント
// eslint-disable-next-line react/prop-types
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

// メインの「ツールの使い方」コンポーネント
const ToolUsageGuide = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBgColor = useColorModeValue("white", "gray.800");

  return (
    <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
      <VStack spacing={{ base: 8, md: 12 }} align="stretch">
        {/* === セクションタイトル === */}
        <Box>
          <Heading as="h2" size="lg" mb={2}>
            ツールの使い方
          </Heading>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
            3つの簡単なステップで粗利率を計算できます。
          </Text>
        </Box>

        {/* === ステップ説明 === */}
        <VStack spacing={8} align="stretch">
          <FeatureStep step="1" title="数値を入力">
            「売価」「原価」「粗利率」のそれぞれの入力欄に、計算したい商品の数値を入力してください。
          </FeatureStep>
          <FeatureStep step="2" title="「計算する」をクリック">
            入力が終わったら、「税抜」「税込」「税込（軽減税率）」から、数値をどれで計算するのかを選び、「計算する」ボタンをクリックします。
          </FeatureStep>
          <FeatureStep step="3" title="結果を確認">
            計算結果に表示されます。入力値を変更すれば、すぐに再計算できます。
          </FeatureStep>
        </VStack>

        <Divider borderColor={borderColor} />

        {/* === 計算例 === */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="md">
            <Icon as={InfoIcon} mr={2} color="primary" />
            具体的な計算例
          </Heading>
          <Box
            p={{ base: 5, md: 8 }}
            bg={cardBgColor}
            borderRadius="xl"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="stretch">
              <Text>
                例えば、800円で仕入れた（原価）商品を、1000円で販売した（売価）場合...
              </Text>
              <Box bg={bgColor} p={4} borderRadius="md">
                <Text fontFamily="monospace">
                  ・売価:{" "}
                  <Text as="span" fontWeight="bold">
                    1000
                  </Text>{" "}
                  円
                </Text>
                <Text fontFamily="monospace">
                  ・原価:{" "}
                  <Text as="span" fontWeight="bold">
                    800
                  </Text>{" "}
                  円
                </Text>
              </Box>
              <Text fontWeight="bold" fontSize="lg">
                計算結果は以下のようになります。
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
                    粗利: 200円 / 粗利率: 20%
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
};

export default ToolUsageGuide;
