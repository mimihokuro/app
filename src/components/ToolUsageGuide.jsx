import { Container, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import UsageSteps from "./UsageSteps"; // 作成したコンポーネントをインポート
import UsageExample from "./UsageExample"; // 作成したコンポーネントをインポート

const ToolUsageGuide = ({ toolName, description, steps, example }) => {
  return (
    <Container maxW="container.lg" px={0} py={{ base: 8, md: 12 }}>
      <VStack spacing={{ base: 8, md: 12 }} align="stretch">
        {/* 説明とステップのコンポーネントを呼び出し */}
        <UsageSteps
          toolName={toolName}
          description={description}
          steps={steps}
        />

        {/* 計算例データがある場合のみ、計算例コンポーネントを呼び出し */}
        {example && <UsageExample example={example} />}
      </VStack>
    </Container>
  );
};

// 親コンポーネントが受け取るpropsの型定義は、以前と同じ
ToolUsageGuide.propTypes = {
  toolName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  example: PropTypes.object, // exampleは必須ではないのでobjectとする
};

export default ToolUsageGuide;
