import { FiCheck } from "react-icons/fi";
import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ExecuteButton = ({
  buttonFunc,
  icon,
  variant = "solid",
  color = variant === "solid" ? "colorWhite" : "primary",
  bgColor = variant === "solid" ? "primary" : "transparent",
  text = "実行する",
}) => {

  const handleClick = (e) => {
    // 1. 本来の計算・実行処理を呼び出す
    if (buttonFunc) {
      buttonFunc(e);
    }

    // 2. 「計算する」「生成する」などの実行系ボタンの場合、スマホ表示時のみ結果エリアにスクロールする
    const isExecutionBtn = text.includes("計算") || text.includes("生成") || text.includes("実行");
    if (isExecutionBtn && typeof window !== "undefined" && window.innerWidth < 992) {
      setTimeout(() => {
        // 「結果」という文言が含まれる見出し要素を検索
        const headings = Array.from(document.querySelectorAll("h2, h3, .chakra-heading"));
        const resultHeading = headings.find(el => 
          el.textContent.includes("結果")
        );

        if (resultHeading) {
          // 最も近い親コンテナ（結果表示枠）を取得
          const resultSection = resultHeading.closest("div, section");
          // App.jsx 内のスクロール可能なメインコンテナを取得
          const scrollContainer = document.querySelector(".overflow-y-auto");

          if (scrollContainer && resultSection) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elemRect = resultSection.getBoundingClientRect();
            const relativeTop = elemRect.top - containerRect.top;

            // スクロール可能なコンテナのスクロール位置を調整（ヘッダーの重なりを考慮し24px空ける）
            scrollContainer.scrollTo({
              top: scrollContainer.scrollTop + relativeTop - 24,
              behavior: "smooth"
            });
          }
        }
      }, 100); // レンダリング完了のための微小ディレイ
    }
  };

  return (
    <Button
      leftIcon={icon || <FiCheck />}
      colorScheme="teal"
      color={color}
      backgroundColor={bgColor}
      _hover={
        variant === "solid"
          ? { backgroundColor: "secondary" }
          : { color: "secondary" }
      }
      variant={variant}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

ExecuteButton.propTypes = {
  buttonFunc: PropTypes.func.isRequired,
  icon: PropTypes.element,
  variant: PropTypes.oneOf(["solid", "ghost", "outline", "link", "unstyled"]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  text: PropTypes.string,
};

export default ExecuteButton;
