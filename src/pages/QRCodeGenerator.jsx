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
      "WebサイトURL、SNSアカウント、テキストメッセージから瞬時に高解像度QRコード（PNG画像）を生成・ダウンロードできる無料ジェネレーターです。最高水準の誤り訂正レベル（Level H: 約30%復元）を採用しており、EC商品の同梱チラシ、ショップカード、名刺、店頭POPなどの印刷用途にも安心してご利用いただけます。",
    logicSteps: [
      {
        title: "URL・文字列データのエンコード",
        description:
          "入力されたURL（https://〜）や文字列を解析し、英数字・記号・日本語（漢字/かな）に最適な文字モードで2次元バーコードパターンへ変換します。",
      },
      {
        title: "高精度な誤り訂正コード（リード・ソロモン符号）の付加",
        description:
          "最高レベルの誤り訂正率（Level H: 30%）を標準適用。印刷のかすれ、汚れ、中央へのロゴ配置などがあってもスマートフォンで確実に読み取れる耐性を備えます。",
      },
      {
        title: "ブラウザ内HTML5 Canvas描画とPNG書き出し",
        description:
          "サーバー通信を行わずにお客様のブラウザ上で高解像度Canvasレンダリングを行い、ワンクリックで劣化のないPNGファイルとして保存します。",
      },
    ],
    benchmarkTable: {
      title: "【用途別】QRコードの推奨印刷サイズと読み取り距離の目安",
      headers: ["利用用途・媒体", "一般的な読み取り距離", "推奨される最小印刷サイズ", "誤り訂正レベル / 注意点"],
      rows: [
        [
          "名刺・ショップカード",
          "約 10cm 〜 15cm",
          "15mm × 15mm 以上（最小12mm）",
          "Level M または H。小さすぎるとピントが合わず読み取りエラーの原因に。",
        ],
        [
          "商品同梱チラシ・パンフレット・A4書類",
          "約 15cm 〜 30cm",
          "20mm × 20mm 以上",
          "Level H 推奨。周囲に余白（クワイエットゾーン）を十分に確保。",
        ],
        [
          "商品パッケージ・化粧箱・ラベルシール",
          "約 10cm 〜 20cm",
          "15mm × 15mm 〜 25mm × 25mm",
          "光沢フィルムや曲面への印刷時は反射・歪みで読みにくくなるため大きめに配置。",
        ],
        [
          "店頭卓上POP・レジ横案内",
          "約 20cm 〜 40cm",
          "30mm × 30mm 以上",
          "Level H 推奨。LINE友だち追加や決済用など、ストレスなく瞬時に読めるサイズ。",
        ],
        [
          "ポスター・屋外看板・イベントパネル",
          "約 1m 〜 3m",
          "100mm × 100mm 以上（距離の1/10目安）",
          "読み取り距離の『1/5〜1/10』のサイズを目安に拡大印刷。",
        ],
      ],
    },
    proTips: [
      {
        title: "QRコードの周囲に必ず「余白（クワイエットゾーン）」を設ける",
        description:
          "QRコードの読み取り性能を担保するためには、コードの周囲に最低でも『セル4個分以上』の無地スペース（余白）が必要です。デザイン枠や背景写真、文字がQRコードの枠線に近すぎると、カメラがコード領域を認識できなくなります。",
      },
      {
        title: "印刷前に必ず複数のスマートフォン・実機カメラでテストする",
        description:
          "画面上では綺麗に見えても、家庭用プリンターや印刷所の網点（網掛け）によってコードが潰れることがあります。必ず実際に紙に印刷し、iPhoneとAndroidの標準カメラアプリで正常に読み取れるか実機テストを行いましょう。",
      },
      {
        title: "URLパラメータ（UTMパラメータ）を付与して効果測定を行う",
        description:
          "同梱チラシやPOPに掲載するURLには、『?utm_source=flyer&utm_medium=qr&utm_campaign=2026spring』のようなGA4計測パラメータを付与しておくことで、Googleアナリティクス上で印刷物経由のアクセス数や売上を正確に追跡・分析できます。",
      },
    ],
    useCases: [
      {
        title: "EC商品発送時のサンクスレター・同梱チラシ",
        description:
          "商品レビュー投稿ページ、LINE公式アカウントの友だち追加、次回使える限定クーポンページへの誘導に。",
      },
      {
        title: "商品パッケージ・取扱説明書（Webマニュアル）",
        description:
          "紙の説明書を簡素化し、詳しい使い方動画や電子マニュアル（PDF）へ直接アクセスさせるためのQR掲載に。",
      },
      {
        title: "名刺・ポートフォリオ・展示会ブース",
        description:
          "名刺からWebサイト・SNS・連絡先登録ページへ瞬時にアクセスしてもらうための導線設計に。",
      },
      {
        title: "飲食・小売店舗のモバイルオーダー・Wi-Fi接続",
        description:
          "テーブルPOPから注文ページやGoogleビジネスプロフィールのクチコミ投稿画面への誘導に。",
      },
    ],
    faqs: [
      {
        question: "生成したQRコードに有効期限はありますか？",
        answer:
          "いいえ、当ツールで生成されるQRコードは、入力されたURLや文字列そのものが直接埋め込まれた「静的QRコード」です。当サイトを経由せずに直接目的のURLへ接続するため、有効期限はなく半永久的に利用可能です。",
      },
      {
        question: "商用利用（チラシ印刷や商品への印字）は可能ですか？有料ですか？",
        answer:
          "完全無料で、個人利用・商用利用を問わず自由にご利用いただけます。クレジット表記や許諾申請も不要です。",
      },
      {
        question: "QRコードの中に文字を多く入れすぎるとどうなりますか？",
        answer:
          "文字数（データ量）が多くなるほど、QRコードのマス目（セル）が細かくなり、小さく印刷した際にスマートフォンのカメラで読み取りにくくなります。長文のURLは短縮URLサービスなどを活用して短くすると読み取りやすくなります。",
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
        benchmarkTable={guideData.benchmarkTable}
        proTips={guideData.proTips}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
      <Box textAlign="center" pt={2} pb={4}>
        <Text fontSize="xs" color="gray.400">
          ※「QRコード」は株式会社デンソーウェーブの登録商標です。
        </Text>
      </Box>
    </Stack>
  );
}

export default QRCodeGenerator;
