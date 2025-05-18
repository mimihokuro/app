import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const NumberInputForm = ({ id, label, value, onChange }) => {
  return (
    <FormControl maxWidth={36}>
      <FormLabel htmlFor={id}>{label}</FormLabel>

      <NumberInput
        id={id}
        value={value}
        onChange={onChange}
        borderColor="colorGray"
        focusBorderColor="primary"
        backgroundColor="colorWhite"
      >
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );
};

NumberInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumberInputForm;
