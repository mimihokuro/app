import { Link as ChakraLink } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { IoArrowDownCircleOutline } from "react-icons/io5";

const ToolUsageGuideAnchor = ({ children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById("tool-usage-guide");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ChakraLink
      display={"inline-flex"}
      placeItems={"center"}
      href="#tool-usage-guide"
      color="primary"
      fontWeight="bold"
      variant="underline"
      onClick={handleClick}
    >
      {children || "ツールの使い方はこちら"}
      <IoArrowDownCircleOutline size={24} />
    </ChakraLink>
  );
};

ToolUsageGuideAnchor.propTypes = {
  children: PropTypes.node,
};

export default ToolUsageGuideAnchor;
