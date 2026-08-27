import {
  Button,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { css } from "@emotion/react";
import MainContentsHeading from "../components/MainContentsHeading";
import { FiCopy } from "react-icons/fi";
import ToolGuideSection from "../components/ToolGuideSection";

function CharacterCounter() {
  usePageMetadata({
    title: "文字数カウントツール | EC Tool Crate",
    description:
      "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。",
    canonicalUrl: "https://ec-tool-crate.com/character-counter",
    ogTitle: "文字数カウントツール | EC Tool Crate",
    ogDescription:
      "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。",
    ogType: "website"
  });

  const [text, setText] = useState("");
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const characterCount = text.length;
  const characterCountWithoutSpaces = text.replace(/\s/g, "").length;

  function isHankaku(char) {
    if (!char || char.length !== 1) {
      return false; // 空文字や複数文字の場合は対象外
    }
    const charCode = char.charCodeAt(0);
    // 改行文字 (LF: Line Feed)
    if (charCode === 0x000a) {
      // \n の文字コード
      return true;
    }
    // ASCII printable characters (space to ~)
    if (charCode >= 0x0020 && charCode <= 0x007e) {
      return true;
    }

    // Half-width Katakana
    if (charCode >= 0xff61 && charCode <= 0xff9f) {
      return true;
    }

    // 他にも半角と見なす文字があればここに追加できます
    // 例: 一部の半角記号など

    return false;
  }

  function calculateSpecialLength(text) {
    let count = 0;
    for (const char of text) {
      // 改行文字の扱い: ここでは改行も1文字（または0.5文字）としてカウントされます。
      // 仕様に応じて、改行を無視するなどの処理を追加できます。
      // 例えば、改行をカウントしない場合:
      // if (char === '\n') continue;

      if (isHankaku(char)) {
        count += 0.5;
      } else {
        count += 1;
      }
    }
    return count;
  }

  // 単語数のカウント（簡易版：スペース区切り）
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // 行数のカウント
  const lineCount = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
  const specialLengthCount = calculateSpecialLength(text);
  const specialLengthCountWithoutSpaces = calculateSpecialLength(
    text.replace(/\s/g, "")
  );

  const RESULT_ITEMS = [
    { value: characterCount, label: "文字数" },
    { value: characterCountWithoutSpaces, label: "文字数（空白除く）" },
    { value: specialLengthCount, label: "全角＝1文字、半角＝0.5文字換算" },
    {
      value: specialLengthCountWithoutSpaces,
      label: "全角＝1文字、半角＝0.5文字換算（空白除く）",
    },
    { value: wordCount, label: "単語数（空白区切り）" },
    { value: lineCount, label: "行数" },
  ];

  const handleCopyInputText = async () => {
    if (!text) {
      toast({
        title: "テキストがありません",
        description: "入力エリアにテキストがありません。",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "コピーしました！",
        description: "入力テキストがクリップボードにコピーされました。",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: toastPosition,
      });
    } catch (err) {
      toast({
        title: "コピー失敗",
        description: "クリップボードへのコピーに失敗しました。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      console.error("Failed to copy input text: ", err);
    }
  };

  const handleClearText = () => {
    setText("");
    toast({
      title: "クリアしました",
      description: "入力テキストをクリアしました。",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: toastPosition,
    });
  };

  const guideData = {
    title: "文字数カウントツール",
    summary:
      "入力したテキストの総文字数・空白除外文字数・全角半角換算（全角1/半角0.5）・単語数・行数をリアルタイムに計測する高機能文字数カウンターです。ECモールの商品タイトル・キャッチコピー文字数制限のチェック、SEOメタタグ作成、Web広告文・SNS投稿の作成業務を大幅に効率化します。",
    logicSteps: [
      {
        title: "リアルタイム自動カウント",
        description:
          "テキストエリアへの入力・貼り付けと同時にJavaScriptで即座に解析を実行し、ブラウザの負荷なくミリ秒単位で集計結果を更新します。",
      },
      {
        title: "全角・半角換算（全角=1文字 / 半角=0.5文字）",
        formula: "換算文字数 = 全角文字数 + (半角英数・半角カナ数 × 0.5)",
        description:
          "楽天市場やYahoo!ショッピングのキャッチコピー規約、X（旧Twitter）の投稿カウント仕様に対応した精密な半角0.5文字換算を行います。",
        example:
          "「ECツール2026」の場合 → 全角5文字 + 半角4文字(2換算) = 合計7.0文字",
      },
      {
        title: "空白・改行の除外カウント",
        description:
          "全角スペース・半角スペース・タブ・改行コードを取り除いた純粋な文章テキストのみの文字数を算出し、文字数指定のある原稿作成に対応します。",
      },
    ],
    benchmarkTable: {
      title: "【主要ECモール・媒体別】商品名・メタタグの文字数制限一覧",
      headers: ["プラットフォーム / 媒体", "対象項目", "上限文字数・推奨文字数", "実務上のポイント"],
      rows: [
        [
          "楽天市場",
          "商品名 (item_name)",
          "最大 全角127文字（半角255文字）",
          "スマホ検索結果では最初の約30〜35文字のみが表示されるため、重要キーワードを先頭に配置。",
        ],
        [
          "楽天市場",
          "キャッチコピー (catch_copy)",
          "最大 全角87文字（半角174文字）",
          "セール情報、送料無料、クーポン情報などを訴求。スマホ用キャッチコピーは全角60文字以内。",
        ],
        [
          "Yahoo!ショッピング",
          "商品名",
          "最大 全角75文字",
          "キーワードの詰め込みすぎはスパム判定の原因となるため、検索重要度の高い順に並べる。",
        ],
        [
          "Amazon",
          "商品タイトル",
          "最大 全角100文字（半角200文字推奨）",
          "ブランド名＋商品名＋型番＋カラー/サイズを基本構成にし、販促文句（送料無料等）は避ける。",
        ],
        [
          "Google SEO",
          "タイトルタグ (<title>)",
          "全角 30〜35文字以内",
          "検索結果一覧で省略記号（…）にならず確実に表示される安全圏の文字数。",
        ],
        [
          "Google SEO",
          "メタディスクリプション",
          "全角 80〜120文字（PC:120文字 / スマホ:80文字）",
          "検索意図に答える要約文を記述。冒頭70文字以内に惹きつけ文を入れるのが効果的。",
        ],
      ],
    },
    proTips: [
      {
        title: "スマホ画面で『切れない（…にならない）』先頭30文字に最重要キーワードを置く",
        description:
          "楽天やAmazon、Yahoo!ショッピング等の検索結果画面（特にスマートフォン）では、商品名の全文字が表示されず、最初の30〜35文字程度で省略されます。『ブランド名・商品カテゴリ・特徴』は必ず冒頭に記載し、後半に型番や補足キーワードを配置するのがEC運用の鉄則です。",
      },
      {
        title: "全角スペースと半角スペースの混在に注意する",
        description:
          "モール内検索エンジンでは、キーワード間の区切りとしてスペースが重要視されます。全角スペースが連続していたり、不要なスペースが入っていると検索キーワードとして正常にインデックスされない場合があるため、本ツールの『空白除く文字数』も併せて確認しましょう。",
      },
      {
        title: "文字化けや機種依存文字（絵文字・丸数字・ローマ数字）の扱い",
        description:
          "絵文字や特殊な丸数字（①、②など）はプラットフォームによって文字化けしたり、システムエラー（CSV一括登録時のエラー）の原因になることがあります。EC出品時は標準的な半角英数や括弧【 】を活用することをおすすめします。",
      },
    ],
    useCases: [
      {
        title: "ECサイトの商品タイトル・キャッチコピー作成",
        description:
          "楽天市場（全角127文字/87文字）、Yahoo!ショッピング（全角75文字）、Amazonの文字数上限をチェックしながらのタイトル作成に。",
      },
      {
        title: "SEO記事・メタタグ（Title / Description）の推敲",
        description:
          "検索エンジン結果で省略されないタイトル（30〜35文字）やメタディスクリプション（80〜120文字）の文字数調整に。",
      },
      {
        title: "Web広告（Google・Yahoo!リスティング）のテキスト管理",
        description:
          "リスティング広告の見出し（半角30文字/全角15文字）や説明文（半角90文字/全角45文字）のレギュレーション確認に。",
      },
      {
        title: "メルマガ・LINE公式アカウントの配信メッセージ作成",
        description:
          "LINEの吹き出し（500文字以内）やメルマガのファーストビューに収まる最適な行数・文字数バランスの確認に。",
      },
    ],
    faqs: [
      {
        question: "入力した文章や原稿が外部サーバーに送信・保存されることはありますか？",
        answer:
          "いいえ、文字数の集計処理はすべてお客様がお使いのWebブラウザ（JavaScript）内部で完結しています。入力されたテキストが当サイトのサーバーに送信されたり、ログ等に保存されることは一切ございませんので、機密文章や未公開の商品原稿でも安心してご利用いただけます。",
      },
      {
        question: "「全角＝1文字、半角＝0.5文字換算」とはどのような計算ですか？",
        answer:
          "漢字・ひらがな・カタカナ・全角記号を1文字、半角英数字・半角スペース・半角カタカナを0.5文字として集計する計算方法です。楽天市場のキャッチコピー文字数制限や、X（旧Twitter）等の文字数カウント規約に準拠した形式です。",
      },
      {
        question: "改行は文字数に含まれますか？",
        answer:
          "標準の「文字数」には改行コード（1文字分）が含まれます。「文字数（空白除く）」では改行コードやスペースがすべて除外された純粋な文字列のみの文字数がカウントされます。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"🔡 文字数カウントツール"}
        pageDescription={
          "文字数カウントツールです。入力したテキストの文字数を入力と同時にリアルタイムでカウントします。"
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
          <MainContentsHeading heading="文字入力" />
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="ここにテキストを入力してください..."
            size="md"
            minHeight="200px"
            borderColor="colorGray"
            borderRadius={6}
            _hover={{ borderColor: "colorGrayDark" }}
            _focus={{
              borderColor: "primary",
            }}
          />
          <HStack gap={4}>
            <Tooltip label="入力テキストをコピー" placement="top" hasArrow>
              <IconButton
                icon={<FiCopy />}
                size="md"
                backgroundColor={"primary"}
                variant="solid"
                onClick={handleCopyInputText}
                aria-label="入力テキストをコピー"
                isDisabled={!text}
              />
            </Tooltip>
            <Tooltip label="クリア" placement="top" hasArrow>
              <Button
                size="md"
                variant="solid"
                backgroundColor={"primary"}
                onClick={handleClearText}
                isDisabled={!text}
              >
                クリア
              </Button>
            </Tooltip>
          </HStack>
        </Stack>

        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="集計結果" />

          <Stack gap={3}>
            {RESULT_ITEMS.map((item, index) => (
              <HStack
                key={index}
                placeContent={"space-between"}
                gap={8}
                px={4}
                py={2}
                borderRadius={8}
                backgroundColor={"colorGrayLight"}
              >
                <Text as={"span"} fontSize="sm">
                  {item.label}
                </Text>
                <Text
                  as={"span"}
                  display={"flex"}
                  placeItems={"center"}
                  gap={1}
                  whiteSpace={"nowrap"}
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  {item.value}
                  <Text as={"span"} fontSize="sm" fontWeight="bold">
                    文字
                  </Text>
                </Text>
              </HStack>
            ))}
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
    </Stack>
  );
}

export default CharacterCounter;
