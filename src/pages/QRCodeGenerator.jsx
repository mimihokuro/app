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

function QRCodeGenerator() {
  usePageMetadata({
    title: "QRコード生成ツール | EC Tool Crate",
    description:
      "QRコード生成ツールです。テキストやURLを入力してQRコードを生成します。",
    canonicalUrl: "https://app.mimihokuro.com/qr-code-generator",
    ogTitle: "QRコード生成ツール | EC Tool Crate",
    ogDescription:
      "QRコード生成ツールです。テキストやURLを入力してQRコードを生成します。",
    ogType: "website"
  });

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
      // 入力が空の場合はアラートを表示
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
      // 入力がある場合はQRコードを生成
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
      // refからCanvas要素を取得
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        // Canvasから画像データURLを取得
        const image = canvas.toDataURL("image/png"); // PNG形式で取得
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png"; // ダウンロード時のファイル名
        document.body.appendChild(link); // リンクをDOMに追加
        link.click(); // リンクをプログラム的にクリック
        document.body.removeChild(link); // クリック後、リンクをDOMから削除
      } else {
        alert("QRコードがまだ生成されていないか、要素が見つかりません。");
      }
    }
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📱QRコード生成ツール"}
        pageDescription={
          "QRコード生成ツールです。テキストやURLを入力してQRコードを生成します。"
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
    </Stack>
  );
}

export default QRCodeGenerator;
