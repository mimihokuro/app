import { Table, Tr, Th, Td, Tbody, TableContainer } from "@chakra-ui/react";
import PropTypes from "prop-types";

const DisplayResult = ({ result }) => {
  const { daysInPeriod, numberOfHolidays } = result;

  const TABLE_CONTENTS = [
    { label: "期間日数", value: daysInPeriod },
    { label: "休日数", value: numberOfHolidays },
    { label: "期間日数 - 休日数", value: daysInPeriod - numberOfHolidays },
  ];

  return (
    <>
      {
        <TableContainer>
          <Table>
            <Tbody>
              {TABLE_CONTENTS.map((data, index) => {
                return (
                  <Tr key={index}>
                    <Th
                      border="1px"
                      borderColor="#dddddd"
                      fontWeight="bold"
                      fontSize={14}
                      backgroundColor="#f0f0f0"
                      py={4}
                    >
                      {data.label}
                    </Th>
                    <Td
                      textAlign="center"
                      border="1px"
                      borderColor="#dddddd"
                      fontWeight="bold"
                      py={4}
                    >
                      {data.value} 日
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      }
    </>
  );
};
DisplayResult.propTypes = {
  result: PropTypes.shape({
    daysInPeriod: PropTypes.number.isRequired,
    numberOfHolidays: PropTypes.number.isRequired,
  }).isRequired,
};

export default DisplayResult;
