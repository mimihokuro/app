import { ArrowRightIcon } from "@chakra-ui/icons";
import { Flex, Input, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const SelectDate = ({ dateData }) => {
  const { startDate, setStartDate, endDate, setEndDate } = dateData;
  return (
    <>
      <Flex
        placeItems="center"
        gap={4}
        direction={{ base: "column", sm: "row" }}
      >
        <Input
          type="date"
          variant="filled"
          size="md"
          focusBorderColor="primary"
          value={startDate}
          aria-labelledby="期間開始日"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <ArrowRightIcon
          transform={{ base: "rotate(90deg)", sm: "rotate(0deg)" }}
        />
        <Input
          type="date"
          variant="filled"
          size="md"
          focusBorderColor="primary"
          value={endDate}
          aria-labelledby="期間終了日"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Flex>
      {startDate > endDate ? (
        <Text color="palevioletred" fontWeight="bold" textAlign="center" mt={2}>
          正しい期間を選択してください
        </Text>
      ) : null}
    </>
  );
};
SelectDate.propTypes = {
  dateData: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    setStartDate: PropTypes.func.isRequired,
    endDate: PropTypes.string.isRequired,
    setEndDate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SelectDate;
