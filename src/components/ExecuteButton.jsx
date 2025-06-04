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
  buttonFunc: PropTypes.func.isRequired,
  icon: PropTypes.element,
  variant: PropTypes.oneOf(["solid", "ghost", "outline", "link", "unstyled"]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  text: PropTypes.string,
};

export default ExecuteButton;
