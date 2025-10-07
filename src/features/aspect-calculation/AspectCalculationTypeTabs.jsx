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
import WidthFromRatioAndHeight from "./WidthFromRatioAndHeight";

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
            「横幅」と「縦幅」から比率計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            「横幅」と「比率」から縦幅計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            「縦幅」と「比率」から横幅計算
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <CalculateFromWidthAndHeight />
          </TabPanel>
          <TabPanel px={0}>
            <HeightFromRatioAndWidth />
          </TabPanel>
          <TabPanel px={0}>
            <WidthFromRatioAndHeight />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
