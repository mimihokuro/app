import React from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Portal,
} from "@chakra-ui/react";
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
  PiList,
  PiDotsThree,
  PiCopy,
  PiCheck,
  PiFacebookLogo,
  PiGlobe,
  PiEnvelope,
  PiShieldCheck,
} from "react-icons/pi";

const TOOL_MAP = {
  "/": { title: "Home", icon: PiHouse },
  "/holiday-calculator": { title: "休日計算ツール", icon: PiCalendar },
  "/gross-profit-calculator": { title: "粗利計算ツール", icon: PiCalculator },
  "/aspect-ratio-calculator": { title: "アスペクト比計算ツール", icon: PiFrameCorners },
  "/discount-calculator": { title: "割引計算ツール", icon: PiTag },
  "/character-counter": { title: "文字数カウントツール", icon: PiTextT },
  "/time-span-calculator": { title: "期間日時計算ツール", icon: PiHourglass },
  "/qr-code-generator": { title: "QRコード生成ツール", icon: PiQrCode },
  "/wholesale-price-calculator": { title: "卸価格計算ツール", icon: PiCoins },
  "/youtube-embed-generator": { title: "YouTube埋め込みジェネレーター", icon: PiYoutubeLogo }
};

// LINEのインラインアイコンSVG
const LineIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M24 10.3c0-5.7-5.4-10.3-12-10.3S0 4.6 0 10.3c0 5.1 4.3 9.3 10.1 10.1.4.1.9.3 1 .7.1.3.1.8 0 1.2-.1.4-.4 1.8-.5 2.5-.1.6-.5 2.2.2 2.2.7 0 3.3-1.8 4.6-2.7 1.2-.8 2.3-2.1 3.2-3.4 3.3-2.2 5.4-5.6 5.4-9.3z" />
  </svg>
);

// X (Twitter) の最新アイコンSVG
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ShareModal = ({ isOpen, onClose, toolTitle }) => {
  const toast = useToast();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast({
      title: "URLをコピーしました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "top"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `EC Tool Crate - ${toolTitle}が便利！`;
  const xUrl = `https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl" p={2} className="font-sans text-notion-text">
        <ModalHeader fontSize="lg" fontWeight="bold" borderBottom="1px solid" borderColor="#e9e9e7" pb={3}>
          このツールを共有する
        </ModalHeader>
        <ModalCloseButton top="16px" right="16px" />
        <ModalBody py={6} className="flex flex-col gap-6">
          {/* コピー用URL入力欄 */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-notion-textLight uppercase tracking-wider text-left">ページのリンク</span>
            <div className="flex gap-2">
              <Input 
                value={currentUrl} 
                isReadOnly 
                bg="#f7f7f5" 
                borderColor="#e9e9e7"
                _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                fontSize="sm"
              />
              <IconButton
                icon={copied ? <PiCheck /> : <PiCopy />}
                onClick={handleCopy}
                backgroundColor="#0f7b4b"
                color="white"
                _hover={{ backgroundColor: "#196343" }}
                aria-label="Copy link"
                className="flex-shrink-0"
              />
            </div>
          </div>

          {/* SNS共有ボタン */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-notion-textLight uppercase tracking-wider text-left">SNSで共有する</span>
            <div className="grid grid-cols-3 gap-3">
              {/* X (Twitter) */}
              <a 
                href={xUrl} 
                target="_social" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-3 border border-[#e9e9e7] rounded-xl hover:bg-[#efefed] transition-colors no-underline text-notion-text"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg">
                  <XIcon />
                </div>
                <span className="text-xs font-medium">X (Twitter)</span>
              </a>

              {/* Facebook */}
              <a 
                href={fbUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-3 border border-[#e9e9e7] rounded-xl hover:bg-[#efefed] transition-colors no-underline text-notion-text"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xl">
                  <PiFacebookLogo />
                </div>
                <span className="text-xs font-medium">Facebook</span>
              </a>

              {/* LINE */}
              <a 
                href={lineUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-3 border border-[#e9e9e7] rounded-xl hover:bg-[#efefed] transition-colors no-underline text-notion-text"
              >
                <div className="w-10 h-10 rounded-full bg-[#06C755] text-white flex items-center justify-center text-lg">
                  <LineIcon />
                </div>
                <span className="text-xs font-medium">LINE</span>
              </a>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ShareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  toolTitle: PropTypes.string.isRequired,
};

const Header = ({ onOpen, children }) => {
  const location = useLocation();
  const currentTool = TOOL_MAP[location.pathname] || { title: "Home", icon: PiHouse };
  const CurrentIcon = currentTool.icon;

  // 共有モーダル開閉用
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();

  return (
    <header className="h-12 border-b border-notion-border flex items-center justify-between px-4 bg-white sticky top-0 z-10 font-sans select-none">
      {/* Left side: Mobile menu trigger & Breadcrumb */}
      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-sm text-notion-textLight">
        <button 
          onClick={onOpen} 
          className="lg:hidden p-1 rounded hover:bg-notion-hover text-notion-textLight transition-colors flex items-center justify-center"
          aria-label="Open menu"
        >
          <PiList className="text-xl" />
        </button>
        
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Link to="/" className="truncate hover:underline text-notion-textLight font-medium">EC Tool Crate</Link>
          <span className="text-notion-border font-bold">/</span>
          <span className="flex items-center gap-1 text-notion-text font-medium truncate">
            <CurrentIcon className="text-lg flex-shrink-0" />
            <span className="truncate">{currentTool.title}</span>
          </span>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-2 text-notion-textLight">
        <button 
          onClick={onShareOpen}
          className="hover:bg-notion-hover px-2 py-1 rounded transition-colors text-sm font-medium text-notion-text"
        >
          Share
        </button>

        {/* 三点リーダーのクイックアクセスメニュー */}
        <Menu>
          <MenuButton 
            className="hover:bg-notion-hover p-1.5 rounded transition-colors flex items-center justify-center"
            aria-label="More actions"
          >
            <PiDotsThree className="text-xl" />
          </MenuButton>
          <Portal>
            <MenuList 
              borderRadius="lg" 
              borderColor="#e9e9e7" 
              p={1} 
              className="font-sans text-sm text-notion-text shadow-lg"
              zIndex="2000"
            >
              <MenuItem 
                as={Link} 
                to="/" 
                icon={<PiHouse className="text-base" />}
                borderRadius="md"
                _hover={{ bg: "#efefed" }}
              >
                Home (All Tools)
              </MenuItem>
              <MenuDivider borderColor="#e9e9e7" />
              <MenuItem 
                as={Link} 
                to="/about" 
                icon={<PiGlobe className="text-base" />}
                borderRadius="md"
                _hover={{ bg: "#efefed" }}
              >
                当サイトについて
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/contact" 
                icon={<PiEnvelope className="text-base" />}
                borderRadius="md"
                _hover={{ bg: "#efefed" }}
              >
                お問い合わせ
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/privacy-policy" 
                icon={<PiShieldCheck className="text-base" />}
                borderRadius="md"
                _hover={{ bg: "#efefed" }}
              >
                プライバシーポリシー
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>

        {children && <div className="ml-2 flex items-center">{children}</div>}
      </div>

      {/* 共有モーダル */}
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={onShareClose} 
        toolTitle={currentTool.title} 
      />
    </header>
  );
};

Header.propTypes = {
  onOpen: PropTypes.func,
  children: PropTypes.node,
};

export default Header;
