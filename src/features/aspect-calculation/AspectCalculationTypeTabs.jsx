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
          <Tab>幅と高さから比率計算</Tab>
          <Tab>幅もしくは高さと比率からサイズ計算</Tab>
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
