import { Heading } from "@chakra-ui/react";
import PropTypes from "prop-types";

const MainContentsHeading = ({ heading }) => {
  return (
    <Heading
      as={"h2"}
      pb={2}
      fontSize={18}
      borderBottom={"1px solid"}
      borderBottomColor="colorGray"
    >
      {heading}
    </Heading>
  );
};

MainContentsHeading.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default MainContentsHeading;
