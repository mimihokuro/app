import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { PiBookOpen, PiLightbulb, PiQuestion, PiCalculator } from "react-icons/pi";

/**
 * ツール下部に表示する詳細解説・ガイドセクション
 *
 * @param {Object} props
 * @param {string} props.title ツール名
 * @param {string} props.summary 概要テキスト
 * @param {Array<{title: string, formula?: string, description: string, example?: string}>} props.logicSteps 計算ロジック・計算式
 * @param {Array<{title: string, description: string}>} props.useCases 活用シーン
 * @param {Array<{question: string, answer: string}>} props.faqs FAQアイテム
 */
const ToolGuideSection = ({ title, summary, logicSteps = [], useCases = [], faqs = [] }) => {
  // FAQ構造化データ (JSON-LD)
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <VStack gap={10} align="stretch" mt={12} pt={8} borderTop="1px solid" borderColor="gray.200" className="font-sans text-notion-text">
      {/* 構造化データ */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
        />
      )}

      {/* 概要・特徴 */}
      <Box>
        <Heading as="h2" size="md" mb={3} className="flex items-center gap-2 text-notion-text">
          <PiBookOpen className="text-xl text-emerald-600" />
          <span>{title}の特徴と概要</span>
        </Heading>
        <Text color="gray.600" leading="relaxed" fontSize="sm md:base">
          {summary}
        </Text>
      </Box>

      {/* 計算方法・計算ロジック */}
      {logicSteps.length > 0 && (
        <Box>
          <Heading as="h2" size="md" mb={4} className="flex items-center gap-2 text-notion-text">
            <PiCalculator className="text-xl text-emerald-600" />
            <span>計算方法とロジック解説</span>
          </Heading>
          <VStack gap={4} align="stretch">
            {logicSteps.map((step, idx) => (
              <Box
                key={idx}
                p={4}
                bg="#f9f9f8"
                borderRadius="lg"
                border="1px solid"
                borderColor="#e9e9e7"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge colorScheme="green" variant="solid" borderRadius="full" px={2.5}>
                    STEP {idx + 1}
                  </Badge>
                  <Heading as="h3" size="xs" color="gray.800">
                    {step.title}
                  </Heading>
                </div>
                {step.formula && (
                  <Box
                    my={2}
                    p={2.5}
                    bg="white"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="#0f7b4b"
                    fontFamily="monospace"
                    fontSize="sm"
                    color="gray.700"
                  >
                    <strong>計算式:</strong> {step.formula}
                  </Box>
                )}
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {step.description}
                </Text>
                {step.example && (
                  <Text fontSize="xs" color="gray.500" mt={1.5} italic>
                    💡 具体例: {step.example}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* 活用シーン */}
      {useCases.length > 0 && (
        <Box>
          <Heading as="h2" size="md" mb={4} className="flex items-center gap-2 text-notion-text">
            <PiLightbulb className="text-xl text-emerald-600" />
            <span>主な活用シーン</span>
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {useCases.map((useCase, idx) => (
              <Card key={idx} variant="outline" borderColor="#e9e9e7" bg="white" shadow="sm">
                <CardHeader pb={1}>
                  <Heading size="xs" color="gray.800" className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    {useCase.title}
                  </Heading>
                </CardHeader>
                <CardBody pt={2}>
                  <Text fontSize="sm" color="gray.600">
                    {useCase.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* よくある質問 (FAQ) */}
      {faqs.length > 0 && (
        <Box>
          <Heading as="h2" size="md" mb={4} className="flex items-center gap-2 text-notion-text">
            <PiQuestion className="text-xl text-emerald-600" />
            <span>よくある質問 (FAQ)</span>
          </Heading>
          <Accordion allowMultiple defaultIndex={[0]} className="border border-[#e9e9e7] rounded-xl overflow-hidden">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} borderTopWidth={idx === 0 ? 0 : "1px"} borderColor="#e9e9e7">
                <h2>
                  <AccordionButton py={3.5} _hover={{ bg: "#f7f7f5" }}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="sm" color="gray.800">
                      Q. {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="sm" color="gray.600" bg="#fafaf9">
                  A. {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}
    </VStack>
  );
};

ToolGuideSection.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  logicSteps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      formula: PropTypes.string,
      description: PropTypes.string.isRequired,
      example: PropTypes.string,
    })
  ),
  useCases: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
};

export default ToolGuideSection;
