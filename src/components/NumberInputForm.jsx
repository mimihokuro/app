import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const NumberInputForm = ({
  id,
  label,
  value,
  unit,
  onChange,
  max,
  errorMessage,
  isInvalid = false,
  min = 0,
  step = 0.1,
  precision = 1,
}) => {
  return (
    <FormControl maxWidth={"100%"} isInvalid={isInvalid}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <HStack>
        <NumberInput
          id={id}
          value={value}
          min={min}
          max={max}
          step={step}
          precision={precision}
          onChange={onChange}
          borderColor="colorGray"
          focusBorderColor="primary"
          width={"100%"}
          backgroundColor="colorWhite"
        >
          <NumberInputField />
        </NumberInput>
        {unit && <Text>{unit}</Text>}
      </HStack>
      {isInvalid && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};

NumberInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  precision: PropTypes.number,
  unit: PropTypes.string,
  errorMessage: PropTypes.string,
  isInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default NumberInputForm;
