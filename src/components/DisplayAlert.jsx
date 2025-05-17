import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";
import PropTypes from "prop-types";

const DisplayAlert = ({ status, message }) => {
  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

DisplayAlert.propTypes = {
  status: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default DisplayAlert;
