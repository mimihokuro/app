import { CheckIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ExecuteButton = ({
  buttonFunc,
  icon,
  variant = "solid",
  color = variant === "solid" ? "colorWhite" : "primary",
  bgColor = variant === "solid" ? "primary" : "transparent",
  text = "実行する",
}) => {
  return (
    <Button
      leftIcon={icon || <CheckIcon boxSize={5} />}
      colorScheme="teal"
      color={color}
      backgroundColor={bgColor}
      _hover={
        variant === "solid"
          ? { backgroundColor: "secondary" }
          : { color: "secondary" }
      }
      variant={variant}
      onClick={buttonFunc}
    >
      {text} {/* textプロパティがボタンのテキストとして表示されます */}
    </Button>
  );
};
ExecuteButton.propTypes = {
  buttonFunc: PropTypes.func.isRequired, // 関数であり必須
  icon: PropTypes.element, // JSX要素（Reactコンポーネントなど）であり任意
  variant: PropTypes.oneOf(["solid", "ghost", "outline", "link", "unstyled"])
    .isRequired, // 特定の文字列のいずれかであり任意
  color: PropTypes.string, // 文字列であり任意
  bgColor: PropTypes.string, // 文字列であり任意
  text: PropTypes.string, // 文字列であり任意
};

export default ExecuteButton;
