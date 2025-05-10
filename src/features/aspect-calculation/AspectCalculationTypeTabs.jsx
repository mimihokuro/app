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
    <Stack width="100%" border="1px #dddddd solid" mt={4} p={4}>
      <Tabs>
        <TabList value={value} onChange={handleChange}>
          <Tab>幅と高さから縦横比計算</Tab>
          <Tab>縦横比と幅から高さを計算</Tab>
          <Tab>縦横比と高さから幅を計算</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <CalculateFromWidthAndHeight />
          </TabPanel>
          <TabPanel px={0}>
            <HeightFromRatioAndWidth />
          </TabPanel>
          <TabPanel px={0}>{/* <CostCalculation /> */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
