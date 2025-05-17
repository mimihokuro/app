import { Heading, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const PageTitle = ({ pageTitle, pageDescription }) => {
  return (
    <Stack>
      <Heading
        as="h1"
        size="lg"
        fontWeight="normal"
        noOfLines={1}
        borderBottom="1px"
        py={2}
        borderBottomColor="#dddddd"
      >
        {pageTitle}
      </Heading>
      <Text mt={2}>{pageDescription}</Text>
    </Stack>
  );
};

PageTitle.propTypes = {
  children: PropTypes.node,
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
};

export default PageTitle;
