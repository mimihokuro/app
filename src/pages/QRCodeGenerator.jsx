import { useRef, useState } from "react";
import {
  FormControl,
  Input,
  Stack,
  Grid,
  Box,
  Text,
  useToast,
  useBreakpointValue,
  ButtonGroup,
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import { css } from "@emotion/react";
import PageTitle from "../components/PageTitle";
import MainContentsHeading from "../components/MainContentsHeading";
import usePageMetadata from "../hooks/usePageMetadata";
import ExecuteButton from "../components/ExecuteButton";
import { FiDownload, FiRefreshCw } from "react-icons/fi";

import ToolGuideSection from "../components/ToolGuideSection";

function QRCodeGenerator() {
  usePageMetadata({
    title: "QRコード生成ツール（無料・高画質PNGダウンロード） | EC Tool Crate",
    description:
      "任意のURLやテキストを入力して、即座に高画質QRコード画像を生成・PNGダウンロードできる無料ツールです。チラシ、名刺、ECショップの案内、店頭POP制作に最適です。",
    canonicalUrl: "https://ec-tool-crate.com/qr-code-generator",
    ogTitle: "QRコード生成ツール | EC Tool Crate",
    ogDescription:
      "任意のURLやテキストを入力して、即座に高画質QRコード画像を生成・ダウンロードできる無料ツールです。",
    ogType: "website"
  });

  const guideData = {
    title: "QRコード生成ツール",
    summary:
      "WebサイトのURLやメッセージテキストを入力するだけで、瞬時にQRコード画像（PNG形式）を生成して保存できる便利ツールです。登録不要・完全無料で商用利用も可能です。",
    logicSteps: [
      {
        title: "URL・文字列の入力",
        description: "生成したいWebサイトのURL（https://...）や任意のテキストを入力フォームに入力します。",
      },
      {
        title: "二次元コードの生成と誤り訂正レベル",
        description: "高レベル（Level H: 誤り訂正率約30%）のQRコードエンコードを行い、一部が汚れたり隠れたりしても読み取り可能な堅牢なコードを生成します。",
      },
    ],
    useCases: [
      {
        title: "印刷物・チラシ・同梱物への掲載",
        description:
          "ECサイトで商品発送時に同梱するサンクスレターやショップカードに、レビュー投稿ページやLINE公式アカウントへの誘導QRコードを印字。",
      },
      {
        title: "イベント・名刺・POPでの案内",
        description: "展示会や名刺に自社ポートフォリオやSNSアカウントへのアクセス用QRコードを配置。",
      },
    ],
    faqs: [
      {
        question: "生成されたQRコードに商用利用の制限や有効期限はありますか？",
        answer:
          "いいえ、有効期限や商用利用の制限は一切ありません。チラシ、パッケージ、Web媒体など自由にご利用いただけます。",
      },
    ],
  };

  const [value, setValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const qrCodeRef = useRef(null); // Canvas要素への参照を持つためのref
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleGenerateQRCode = () => {
    if (value === "") {
      toast({
        title: "QRコードを生成できませんでした",
        description:
          "QRコードを生成するためのテキストやURLを入力してください。",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    } else {
      toast({
        title: "QRコードを生成しました",
        description: "入力テキストからQRコードを生成しました。",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: toastPosition,
      });
      setQrCode(value);
    }
  };

  const resetForm = () => {
    setValue("");
    setQrCode("");
    toast({
      title: "入力値と生成結果をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("QRコードがまだ生成されていないか、要素が見つかりません。");
      }
    }
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📱 QRコード生成ツール"}
        pageDescription={
          "QRコード生成ツールです。テキストやURLを入力してQRコードを即座に生成しダウンロードできます。"
        }
      />
      <Grid
        alignItems="start"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={8}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
          }

          grid-template-columns: 1fr;
        `}
      >
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="テキストまたはURL入力" />
          <FormControl id="qr-value">
            <Input
              type="text"
              value={value}
              borderColor="colorGray"
              focusBorderColor="primary"
              onChange={handleInputChange}
              backgroundColor="colorWhite"
              placeholder="QRコードに変換するテキストやURLを入力してください"
            />
          </FormControl>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton buttonFunc={handleGenerateQRCode} text="生成する" />
            <ExecuteButton
              icon={<FiRefreshCw />}
              variant="outline"
              buttonFunc={resetForm}
              text="リセット"
            />
          </ButtonGroup>
        </Stack>
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="QRコード生成結果" />
          <Stack gap={4} alignItems="center">
            {qrCode ? (
              <>
                <Box maxWidth={"160px"} width={"100%"} ref={qrCodeRef}>
                  <QRCodeCanvas
                    value={qrCode}
                    size={256}
                    level="H"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </Box>
                <ExecuteButton
                  icon={<FiDownload boxSize={5} />}
                  buttonFunc={handleDownloadQRCode}
                  text="QRコードをダウンロード"
                />
              </>
            ) : (
              <Text color={"colorGrayDark"}>
                こちらにQRコードが表示されます
              </Text>
            )}
          </Stack>
        </Stack>
      </Grid>
      <ToolGuideSection
        title={guideData.title}
        summary={guideData.summary}
        logicSteps={guideData.logicSteps}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
    </Stack>
  );
}

export default QRCodeGenerator;
