import {
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const NumberInputForm = ({ id, label, value, unit, onChange }) => {
  return (
    <FormControl maxWidth={36}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <HStack>
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
        {unit && <Text>{unit}</Text>}
      </HStack>
    </FormControl>
  );
};

NumberInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default NumberInputForm;
