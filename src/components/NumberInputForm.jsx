import {
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const NumberInputForm = ({ id, label, value, unit, onChange, max }) => {
  return (
    <FormControl maxWidth={36}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <HStack>
        <NumberInput
          id={id}
          value={value}
          min={0}
          max={max}
          step={0.1}
          precision={1}
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
  max: PropTypes.number,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default NumberInputForm;
