import { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import DiscountFromPrices from "./DiscountFromPrices";
import SalePriceFromDiscount from "./SalePriceFromDiscount";

export default function DiscountCalculatorTabs() {
  const [value, setValue] = useState(0);

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
            セール価格から割引値を計算
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "colorGrayDark",
            }}
            borderTopRadius={"8px"}
            fontWeight={"bold"}
          >
            割引値からセール価格を計算
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <DiscountFromPrices />
          </TabPanel>
          <TabPanel px={0}>
            <SalePriceFromDiscount />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
