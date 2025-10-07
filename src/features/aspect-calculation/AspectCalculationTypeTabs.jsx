import * as React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import CalculateFromWidthAndHeight from "./CalculateFromWidthAndHeight";
import HeightFromRatioAndWidth from "./HeightFromRatioAndWidth";

export default function AspectCalculationTypeTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack>
      <Tabs>
        <TabList value={value} onChange={handleChange}>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            「幅」と「高さ」から比率計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            「幅もしくは高さ」と「比率」からサイズ計算
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <CalculateFromWidthAndHeight />
          </TabPanel>
          <TabPanel px={0}>
            <HeightFromRatioAndWidth />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
