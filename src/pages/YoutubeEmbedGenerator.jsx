import { Stack, Box, Text } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";
import YoutubeEmbedGeneratorFeature from "../features/youtube-embed-generator/YoutubeEmbedGeneratorFeature";
import ToolGuideSection from "../components/ToolGuideSection";

const youtubeEmbedGeneratorToolData = {
  toolName: "YouTube埋め込みジェネレーター",
  description:
    "詳細な設定（サイズ・比率固定・パラメータ指定など）を含んだYouTube動画の埋め込み用<iframe>コードを簡単に生成できるツールです。",
  steps: [
    {
      title: "動画URLを入力",
      description:
        "埋め込みたいYouTube動画のURL、または既存の<iframe>コードを入力欄に貼り付けます。",
    },
    {
      title: "表示設定をカスタマイズ",
      description:
        "サイズ（幅・高さ）、比率の固定、各種パラメータ（自動再生、ミュート、コントロール表示など）をお好みで設定します。",
    },
    {
      title: "コードをコピーして利用",
      description:
        "プレビューを確認し、「コードをコピー」ボタンをクリックして生成された<iframe>コードを取得し、自身のサイトに貼り付けます。",
    },
  ],
};

const YoutubeEmbedGenerator = () => {
  usePageMetadata({
    title: "YouTube埋め込みHTMLコードジェネレーター | EC Tool Crate",
    description:
      "YouTube動画のURLから、レスポンシブ対応・比率維持（16:9）の埋め込み用<iframe>HTMLコードを生成する無料ツールです。ブログ記事やECサイトの商品説明ページへの動画埋め込みに最適です。",
    canonicalUrl: "https://ec-tool-crate.com/youtube-embed-generator",
    ogTitle: "YouTube埋め込みジェネレーター | EC Tool Crate",
    ogDescription:
      "YouTube動画のURLから、最新属性対応の埋め込み用<iframe>コードを生成するツールです。",
    ogType: "website",
  });

  const guideData = {
    title: "YouTube埋め込みジェネレーター",
    summary:
      "YouTube動画の標準共有コードではスマホ表示時に枠からはみ出たり、アスペクト比が崩れてしまったりすることがあります。当ツールはレスポンシブWebデザインに対応した綺麗で安全なiframeコードを生成します。",
    logicSteps: [
      {
        title: "URLの解析とVideo IDの抽出",
        description: "通常URL、短縮URL（youtu.be）、Shorts動画URLなどの様々な形式から動画固有のVideo IDを自動検出します。",
      },
      {
        title: "レスポンシブ埋め込みコードのビルド",
        description: "CSSアスペクト比コンテナで囲んだiframeタグを生成し、画面サイズに応じて柔軟に収縮するコードを出力します。",
      },
    ],
    useCases: [
      {
        title: "ECサイトの商品詳細ページへの動画追加",
        description: "商品の使用感やPR動画を商品ページ内にきれいに埋め込んでコンバージョン率を向上。",
      },
      {
        title: "WordPressやメディアブログへの埋め込み",
        description: "スマホ閲覧時にも画面からはみ出さない完全レスポンシブな動画コードの埋め込みに。",
      },
    ],
    faqs: [
      {
        question: "Shorts（ショート動画）のURLにも対応していますか？",
        answer:
          "はい、通常の動画URLだけでなく「youtube.com/shorts/...」のURL形式も自動判定して埋め込みコードを生成します。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"▶️ YouTube埋め込みジェネレーター"}
        pageDescription={
          "YouTube動画のURLから、サイト埋め込み用の<iframe>コードを簡単に生成・カスタマイズできるツールです。"
        }
      />
      <ToolUsageGuideAnchor />

      <YoutubeEmbedGeneratorFeature />
      
      <ToolUsageGuide {...youtubeEmbedGeneratorToolData} />

      <ToolGuideSection
        title={guideData.title}
        summary={guideData.summary}
        logicSteps={guideData.logicSteps}
        useCases={guideData.useCases}
        faqs={guideData.faqs}
      />
      <Box textAlign="center" pt={2} pb={4}>
        <Text fontSize="xs" color="gray.400">
          ※「YouTube」はGoogle LLCの商標または登録商標です。当ツールは非公式の埋め込みコード生成支援ツールです。
        </Text>
      </Box>
    </Stack>
  );
};

export default YoutubeEmbedGenerator;
