import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuide from "../components/ToolUsageGuide";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";
import YoutubeEmbedGeneratorFeature from "../features/youtube-embed-generator/YoutubeEmbedGeneratorFeature";

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
    title: "YouTube埋め込みジェネレーター | EC Tool Crate",
    description:
      "YouTube動画のURLから、サイズ指定・比率固定・最新属性対応の埋め込み用<iframe>コードを生成するツールです。",
    canonicalUrl: "https://app.mimihokuro.com/youtube-embed-generator",
    ogTitle: "YouTube埋め込みジェネレーター | EC Tool Crate",
    ogDescription:
      "YouTube動画のURLから、サイズ指定・比率固定・最新属性対応の埋め込み用<iframe>コードを生成するツールです。",
    ogType: "website",
  });

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
    </Stack>
  );
};

export default YoutubeEmbedGenerator;
