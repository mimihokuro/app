import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  PiHouse,
  PiCalendar,
  PiCalculator,
  PiFrameCorners,
  PiTag,
  PiTextT,
  PiHourglass,
  PiQrCode,
  PiCoins,
  PiYoutubeLogo,
  PiGear,
  PiGlobe,
  PiCaretDown,
  PiCaretRight
} from "react-icons/pi";

const CATEGORIES = [
  {
    category: "EC / Marketing",
    icon: PiCalculator,
    tools: [
      { id: 'gross-profit', title: "粗利計算ツール", url: "/gross-profit-calculator", icon: PiCalculator },
      { id: 'wholesale-price', title: "卸価格計算ツール", url: "/wholesale-price-calculator", icon: PiCoins },
      { id: 'discount', title: "割引計算ツール", url: "/discount-calculator", icon: PiTag },
      { id: 'holiday', title: "休日計算ツール", url: "/holiday-calculator", icon: PiCalendar },
      { id: 'time-span', title: "期間日時計算ツール", url: "/time-span-calculator", icon: PiHourglass }
    ]
  },
  {
    category: "Developer Utilities",
    icon: PiFrameCorners,
    tools: [
      { id: 'aspect-ratio', title: "アスペクト比計算ツール", url: "/aspect-ratio-calculator", icon: PiFrameCorners },
      { id: 'qr-code', title: "QRコード生成ツール", url: "/qr-code-generator", icon: PiQrCode },
      { id: 'youtube-embed', title: "YouTube埋め込みジェネレーター", url: "/youtube-embed-generator", icon: PiYoutubeLogo }
    ]
  },
  {
    category: "Design / Text",
    icon: PiTextT,
    tools: [
      { id: 'character-counter', title: "文字数カウントツール", url: "/character-counter", icon: PiTextT }
    ]
  }
];

const Sidebar = () => {
  const [openCategories, setOpenCategories] = useState({
    "EC / Marketing": true,
    "Developer Utilities": true,
    "Design / Text": true
  });

  const toggleCategory = (catName) => {
    setOpenCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-notion-sidebar border-r border-notion-border text-notion-text w-64 select-none font-sans">
      {/* Workspace Header */}
      <Link to="/" className="p-4 flex items-center justify-between hover:bg-notion-hover transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5 h-5 bg-notion-text text-white flex items-center justify-center rounded text-xs font-bold flex-shrink-0">E</div>
          <span className="font-semibold text-sm truncate">EC Tool Crate</span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 pb-2 text-xs font-semibold text-notion-textLight tracking-wider">
          EC TOOL CRATE
        </div>
        
        <NavLink 
          to="/"
          className={({ isActive }) => 
            `px-4 py-1.5 flex items-center gap-2 cursor-pointer text-sm transition-colors rounded mx-2 mb-2 ${
              isActive ? 'bg-notion-hover font-medium' : 'hover:bg-notion-hover text-notion-text'
            }`
          }
        >
          <PiHouse className="text-lg text-notion-textLight" />
          Home (All Tools)
        </NavLink>

        {CATEGORIES.map((cat, idx) => {
          const isOpen = openCategories[cat.category];
          const CategoryIcon = cat.icon;
          return (
            <div key={idx} className="mt-4">
              <div 
                className="px-4 py-1 flex items-center gap-2 text-sm font-medium text-notion-textLight cursor-pointer hover:bg-notion-hover rounded mx-2"
                onClick={() => toggleCategory(cat.category)}
              >
                {isOpen ? <PiCaretDown className="text-xs" /> : <PiCaretRight className="text-xs" />}
                <CategoryIcon className="text-lg" />
                <span className="truncate">{cat.category}</span>
              </div>
              
              {isOpen && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {cat.tools.map(tool => {
                    const ToolIcon = tool.icon;
                    return (
                      <NavLink 
                        key={tool.id}
                        to={tool.url}
                        className={({ isActive }) => 
                          `pl-9 pr-4 py-1.5 flex items-center gap-2 cursor-pointer text-sm transition-colors rounded mx-2 ${
                            isActive ? 'bg-notion-hover font-medium text-notion-text' : 'hover:bg-notion-hover text-notion-textLight hover:text-notion-text'
                          }`
                        }
                      >
                        <ToolIcon className="text-lg flex-shrink-0" />
                        <span className="truncate">{tool.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer / User info */}
      <div className="p-4 border-t border-notion-border text-xs text-notion-textLight flex justify-between items-center bg-notion-sidebar">
        <Link to="/about" className="hover:underline flex items-center gap-1">
          <PiGlobe /> 当サイトについて
        </Link>
        <Link to="/contact" className="hover:text-notion-text flex items-center gap-1" title="お問い合わせ">
          <PiGear className="text-lg" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
