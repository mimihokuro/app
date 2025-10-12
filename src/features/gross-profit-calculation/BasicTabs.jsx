import * as React from "react";
import GrossMarginRatio from "./GrossMarginRatio";
import SellingPriceCalculation from "./SellingPriceCalculation";
import CostCalculation from "./CostCalculation";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DiscountedPriceCalculation from "./discountedPriceCalculation";

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
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
            粗利益を計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            売価を計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            原価を計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            セール価格と粗利率を計算
          </Tab>
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
          <TabPanel px={0}>
            <DiscountedPriceCalculation />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
