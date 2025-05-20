import * as React from "react";
import GrossMarginRatio from "./GrossMarginRatio";
import SellingPriceCalculation from "./SellingPriceCalculation";
import CostCalculation from "./CostCalculation";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack>
      <Tabs>
        <TabList value={value} onChange={handleChange}>
          <Tab>粗利益計算</Tab>
          <Tab>売価計算</Tab>
          <Tab>原価計算</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <GrossMarginRatio />
          </TabPanel>
          <TabPanel px={0}>
            <SellingPriceCalculation />
          </TabPanel>
          <TabPanel px={0}>
            <CostCalculation />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
