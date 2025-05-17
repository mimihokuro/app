import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const CalculateButton = ({ onClick }) => {
  return (
    <Button width="100%" backgroundColor="primary" onClick={onClick}>
      計算実行
    </Button>
  );
};

CalculateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CalculateButton;
