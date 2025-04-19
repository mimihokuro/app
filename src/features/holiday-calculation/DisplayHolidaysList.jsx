import { ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import PropTypes from "prop-types";

const DisplayHolidaysList = ({ nationalHolidaysInPeriodList }) => {
  const dayText = { weekday: "short" };
  return (
    <Stack mt={8} backgroundColor="#f4f4f4" p={4} borderRadius={8}>
      <Text fontWeight="bold">
        祝日一覧（計{nationalHolidaysInPeriodList.length}日）
      </Text>
      <UnorderedList
        maxH={240}
        listStylePosition="inside"
        textAlign={"left"}
        overflowY="scroll"
      >
        {nationalHolidaysInPeriodList.map((nhl, index) => {
          const outputDate = new Date(nhl.date);
          return (
            <ListItem key={index} fontSize={14}>
              {outputDate.getMonth() + 1}月{outputDate.getDate()}日&#40;
              {outputDate.toLocaleDateString("ja-JP", dayText)}&#41;：
              {nhl.value}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Stack>
  );
};
DisplayHolidaysList.propTypes = {
  nationalHolidaysInPeriodList: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DisplayHolidaysList;
