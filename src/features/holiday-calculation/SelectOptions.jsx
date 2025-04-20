import {
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  TableContainer,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  CheckboxGroup,
  Checkbox,
  Box,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const SelectOptions = ({ optionData }) => {
  const {
    option,
    selectedDays,
    BUSINESS_HOLIDAYS,
    OPTION_HOLIDAYS,
    OPTION_WEEKDAYS,
    handleOptionChange,
    handleDaySelection,
  } = optionData;

  return (
    <TableContainer>
      <Table variant="simple" mt={4}>
        <Tbody>
          <Tr>
            <Th textAlign="left">集計する日は</Th>
            <Td display="flex" gap={2} flexWrap="wrap" py={3} px={2}>
              <RadioGroup value={option} onChange={handleOptionChange}>
                <HStack flexWrap="wrap">
                  {OPTION_HOLIDAYS.map((oh) => {
                    return (
                      <Radio
                        key={oh.value}
                        colorScheme="teal"
                        value={oh.value}
                        color="white"
                        borderColor="gray.400"
                        _checked={{
                          borderColor: "primary",
                          background: "primary",

                          "&::before": {
                            content: '""',
                            color: "white",
                            display: "inline-block",
                            position: "relative",
                            width: "50%",
                            height: "50%",
                            borderRadius: "50%",
                            background: "currentColor",
                          },
                        }}
                      >
                        {oh.title}
                      </Radio>
                    );
                  })}
                </HStack>
              </RadioGroup>
              {option === "weekday_designation" && (
                <Box
                  p={2}
                  border="1px"
                  borderColor="#e0e0e0"
                  borderRadius={8}
                  mt={2}
                >
                  <CheckboxGroup
                    value={selectedDays}
                    onChange={handleDaySelection}
                  >
                    <HStack flexWrap="wrap" gap={4}>
                      {OPTION_WEEKDAYS.map((day) => {
                        return (
                          <Checkbox
                            key={day.value}
                            colorScheme="teal"
                            value={day.value}
                            sx={{
                              "& input:checked + span": {
                                backgroundColor: "primary", // チェック時の背景色
                                borderColor: "primary", // チェック時のボーダー色
                              },
                              "& span": {
                                borderColor: "gray.400", // 未チェック時のボーダー色
                              },
                            }}
                          >
                            <Text as="span" color="black">
                              {day.title}
                            </Text>
                          </Checkbox>
                        );
                      })}
                    </HStack>
                  </CheckboxGroup>
                </Box>
              )}
            </Td>
          </Tr>
          {BUSINESS_HOLIDAYS.map((bh) => {
            return (
              <Tr key={bh.title}>
                <Th textAlign="left">{bh.title}</Th>
                <Td display="flex" placeItems="center" gap={2}>
                  <NumberInput
                    maxW={16}
                    min={0}
                    value={bh.value}
                    onChange={bh.doing}
                    focusBorderColor="primary"
                    borderColor="gray.400"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  日
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
SelectOptions.propTypes = {
  optionData: PropTypes.shape({
    option: PropTypes.string.isRequired,
    selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    BUSINESS_HOLIDAYS: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        doing: PropTypes.func.isRequired,
      })
    ).isRequired,
    OPTION_HOLIDAYS: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
    OPTION_WEEKDAYS: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
    handleOptionChange: PropTypes.func.isRequired,
    handleDaySelection: PropTypes.func.isRequired,
  }).isRequired,
};

export default SelectOptions;
