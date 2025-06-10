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
    BUSINESS_HOLIDAYS_CONFIG,
    OPTION_HOLIDAYS,
    OPTION_WEEKDAYS,
    handleOptionChange,
    handleDaySelection,
  } = optionData;

  return (
    <TableContainer>
      <Table variant="simple" mt={4}>
        <Tbody>
          <Tr borderBlock="1px solid" borderColor="colorGray">
            <Th px={4} textAlign="left" fontSize={14} borderColor="colorGray">
              集計する日は
            </Th>
            <Td
              display="flex"
              gap={2}
              flexWrap="wrap"
              px={2}
              py={3}
              border={"0"}
            >
              <RadioGroup value={option} onChange={handleOptionChange}>
                <HStack flexWrap="wrap">
                  {OPTION_HOLIDAYS.map((oh) => {
                    return (
                      <Radio
                        key={oh.value}
                        colorScheme="teal"
                        value={oh.value}
                        color="white"
                        borderColor="colorGray"
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
                  py={4}
                  px={3}
                  backgroundColor="colorGrayLight"
                  borderColor="colorGray"
                  borderRadius={8}
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
          {BUSINESS_HOLIDAYS_CONFIG.map((bh) => {
            return (
              <Tr
                key={bh.title}
                borderBottom="1px solid"
                borderColor="colorGray"
              >
                <Th
                  px={4}
                  textAlign="left"
                  fontSize={14}
                  borderColor="colorGray"
                >
                  {bh.title}
                </Th>
                <Td
                  display="flex"
                  placeItems="center"
                  gap={2}
                  px={2}
                  border={"0"}
                >
                  <NumberInput
                    maxW={16}
                    min={0}
                    value={bh.value}
                    onChange={bh.setter}
                    focusBorderColor="primary"
                    borderColor="colorGray"
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
    BUSINESS_HOLIDAYS_CONFIG: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        setter: PropTypes.func.isRequired,
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
