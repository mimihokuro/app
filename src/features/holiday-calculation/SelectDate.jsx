import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const SelectDate = ({
  dateData,
  isStartDateInvalid,
  setIsStartDateInvalid,
  isEndDateInvalid,
  setIsEndDateInvalid,
}) => {
  const { startDate, setStartDate, endDate, setEndDate } = dateData;
  return (
    <Stack gap={4}>
      <Flex
        placeItems="center"
        gap={4}
        direction={{ base: "column", sm: "row" }}
      >
        <Stack
          width={{ base: "100%", sm: "auto" }}
          placeSelf={"start"}
          backgroundColor={"colorGrayLight"}
          p={4}
          borderRadius={8}
        >
          <FormControl
            maxWidth={{ base: "100%", sm: 36 }}
            isInvalid={isStartDateInvalid}
          >
            <FormLabel htmlFor={"start"} _hover={{ cursor: "pointer" }}>
              開始日
            </FormLabel>
            <Input
              id="start"
              type="date"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              focusBorderColor="primary"
              backgroundColor={"colorWhite"}
              _focus={{ backgroundColor: "colorWhite" }}
              value={startDate}
              aria-labelledby="期間開始日"
              onChange={(e) => {
                setStartDate(e.target.value);
                setIsStartDateInvalid(false);
              }}
            />
            {isStartDateInvalid && (
              <FormErrorMessage>日付を選択してください</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <ArrowRightIcon
          transform={{ base: "rotate(90deg)", sm: "rotate(0deg)" }}
        />
        <Stack
          width={{ base: "100%", sm: "auto" }}
          backgroundColor={"colorGrayLight"}
          p={4}
          borderRadius={8}
        >
          <FormControl
            maxWidth={{ base: "100%", sm: 36 }}
            isInvalid={isEndDateInvalid}
          >
            <FormLabel htmlFor={"end"} _hover={{ cursor: "pointer" }}>
              終了日
            </FormLabel>
            <Input
              id="end"
              type="date"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              focusBorderColor="primary"
              backgroundColor={"colorWhite"}
              _focus={{ backgroundColor: "colorWhite" }}
              value={endDate}
              aria-labelledby="期間終了日"
              onChange={(e) => {
                setEndDate(e.target.value);
                setIsEndDateInvalid(false);
              }}
            />
            {isEndDateInvalid && (
              <FormErrorMessage>日付を選択してください</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
      </Flex>
    </Stack>
  );
};
SelectDate.propTypes = {
  dateData: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    setStartDate: PropTypes.func.isRequired,
    endDate: PropTypes.string.isRequired,
    setEndDate: PropTypes.func.isRequired,
  }).isRequired,
  isStartDateInvalid: PropTypes.bool,
  setIsStartDateInvalid: PropTypes.func.isRequired,
  isEndDateInvalid: PropTypes.bool,
  setIsEndDateInvalid: PropTypes.func.isRequired,
};

export default SelectDate;
