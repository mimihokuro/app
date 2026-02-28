const fs = require('fs');

const iconMap = {
  InfoIcon: 'FiInfo',
  RepeatIcon: 'FiRefreshCw',
  DownloadIcon: 'FiDownload',
  WarningIcon: 'FiAlertTriangle',
  CopyIcon: 'FiCopy',
  ArrowRightIcon: 'FiArrowRight',
  CheckCircleIcon: 'FiCheckCircle',
  CheckIcon: 'FiCheck',
  HamburgerIcon: 'FiMenu'
};

const files = [
  "c:/Users/keeta/Documents/web-design/dev/app/src/pages/TimeSpanCalculator.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/pages/QRCodeGenerator.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/pages/HolidayCalculator.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/pages/CharacterCounter.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/wholesale-price-calculator/wholesalePriceCalculation.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/holiday-calculation/SelectDate.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/gross-profit-calculation/SellingPriceCalculation.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/gross-profit-calculation/GrossMarginRatio.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/gross-profit-calculation/discountedPriceCalculation.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/gross-profit-calculation/CostCalculation.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/discount-calculator/SalePriceFromDiscount.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/discount-calculator/DiscountFromPrices.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/aspect-calculation/WidthFromRatioAndHeight.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/aspect-calculation/HeightFromRatioAndWidth.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/features/aspect-calculation/CalculateFromWidthAndHeight.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/components/UsageExample.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/components/ExecuteButton.jsx",
  "c:/Users/keeta/Documents/web-design/dev/app/src/App.jsx"
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@chakra-ui\/icons["'];?/g;
  
  content = content.replace(importRegex, (match, p1) => {
    const importedIcons = p1.split(',').map(s => s.trim()).filter(Boolean);
    const newIcons = importedIcons.map(icon => iconMap[icon] || icon);
    return `import { ${newIcons.join(', ')} } from "react-icons/fi";`;
  });

  Object.keys(iconMap).forEach(oldIcon => {
    const newIcon = iconMap[oldIcon];
    const tagRegex = new RegExp(`<${oldIcon}(\\s|>)`, 'g');
    content = content.replace(tagRegex, `<${newIcon}$1`);
    
    const closeTagRegex = new RegExp(`<\/${oldIcon}>`, 'g');
    content = content.replace(closeTagRegex, `<\/${newIcon}>`);
    
    // Replace variables storing the component (e.g. icon={WarningIcon})
    const propRegex = new RegExp(`\\b${oldIcon}\\b`, 'g');
    content = content.replace(propRegex, newIcon);
  });

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Replacement complete.");
