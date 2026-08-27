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
      "YouTube動画の標準共有コードでは、スマートフォン閲覧時に動画枠が画面からはみ出したり、上下に不要な黒帯が入ってしまう問題が発生します。当ジェネレーターは、レスポンシブWebデザイン（16:9比率維持）、プライバシー強化モード（youtube-nocookie.com）、自動再生・ループ・コントロール制御パラメータを含む最新のHTML5 <iframe>コードをワンクリックで生成します。",
    logicSteps: [
      {
        title: "多様なYouTube URL形式からのVideo ID自動抽出",
        description:
          "標準URL（watch?v=...）、短縮共有URL（youtu.be/...）、YouTube Shorts（shorts/...）、埋め込みURL（embed/...）など、あらゆる入力形式から一意の動画識別子（Video ID）を正規表現で正確に検出します。",
      },
      {
        title: "レスポンシブ比率（16:9）を崩さないCSSコンテナ構造の生成",
        description:
          "CSSの `aspect-ratio: 16 / 9;` またはパディングハックを活用したラッパー構造を構築し、PC・タブレット・スマートフォンの画面幅に応じて常に最適な比率で自動伸縮させます。",
      },
      {
        title: "最新のセキュリティ・プライバシー属性の付与",
        description:
          "`loading=\"lazy\"`（遅延読み込み）や `allowfullscreen`、`referrerpolicy` を適切に設定し、Webサイトの初期表示速度（PageSpeed）とセキュリティを担保します。",
      },
    ],
    benchmarkTable: {
      title: "【主要パラメータ別】YouTube埋め込み制御オプション一覧",
      headers: ["パラメータ名", "設定値 / 形式", "機能説明", "実務上の活用例・注意点"],
      rows: [
        [
          "autoplay (自動再生)",
          "autoplay=1 & mute=1",
          "ページ読み込みと同時に動画を自動再生する。",
          "ブラウザの仕様上、自動再生時は必ず `mute=1`（消音）が必須。LPのヒーロー動画に。",
        ],
        [
          "mute (ミュート)",
          "mute=1",
          "動画の音声を最初から消音（ミュート）状態で再生。",
          "ユーザーの意図しない大音量トラブルを防ぐため、自動再生とセットで使用。",
        ],
        [
          "controls (操作バー)",
          "controls=0",
          "再生/一時停止バーや音量調節UIを非表示にする。",
          "Webサイトの背景動画（バックグラウンドビデオ）として利用する際に最適。",
        ],
        [
          "loop (ループ再生)",
          "loop=1 & playlist={VIDEO_ID}",
          "動画終了後に最初から繰り返し再生する。",
          "単一動画のループ再生には、同一の動画IDを `playlist` に指定する必要があります。",
        ],
        [
          "start / end (再生範囲)",
          "start=30 & end=90 (秒数)",
          "動画の特定区間（例: 30秒目〜90秒目）だけを再生。",
          "長尺動画の中から商品紹介の重要シーンだけを切り出して見せたい場合に便利。",
        ],
        [
          "youtube-nocookie",
          "ドメイン切り替え",
          "ユーザーが再生するまでトラッキングCookieを保存しない。",
          "GDPR（EU一般データ保護規則）や個人情報保護の観点から企業サイトで強く推奨。",
        ],
      ],
    },
    proTips: [
      {
        title: "サイト表示速度（PageSpeed Insights）の低下を防ぐ「loading=\"lazy\"」の適用",
        description:
          "iframeタグに `loading=\"lazy\"` 属性を付与することで、ユーザーが動画の位置までスクロールするまでYouTubeスクリプトの読み込みを遅延させることができます。ページの初期ロード時間（LCPスコア）を劇的に改善し、SEO評価を高めます。",
      },
      {
        title: "モバイルでの自動再生制限（音声あり自動再生の禁止ルール）",
        description:
          "iOS SafariやAndroid Chrome等のモバイルブラウザでは、ユーザーのデータ通信量保護と利便性のため『音声付きの動画自動再生』はブラウザ側で強制ブロックされます。自動再生させたい場合は必ずミュート設定（`mute=1`）を併用しましょう。",
      },
      {
        title: "YouTube動画埋め込みによるECサイト・LPの成約率（CVR）向上テクニック",
        description:
          "ECサイトの商品ページでは、静止画だけでは伝わりにくい「サイズ感」「実際の使用シーン」「開封（アンボックス）レビュー」を短い動画で掲載することで、返品率の低下と購入完了率の向上に大きく寄与します。",
      },
    ],
    useCases: [
      {
        title: "ECサイトの商品詳細ページ・レビュー動画の掲載",
        description:
          "商品の組み立て方や着用イメージの公式YouTube動画を、スマホでも崩れないレスポンシブ仕様で埋め込み。",
      },
      {
        title: "WordPressブログ・メディア記事への動画挿入",
        description:
          "解説動画やインタビュー動画を、記事本文の幅（コンテンツ幅100%）に美しくフィットさせて配置。",
      },
      {
        title: "ランディングページ（LP）のファーストビュー動画",
        description:
          "サービス紹介LPの背景動画やメインビジュアルとして、コントロールバーなし・自動ループ動画を埋め込み。",
      },
      {
        title: "企業のプライバシーポリシー準拠（nocookieドメイン対応）",
        description:
          "Cookie同意管理（CMP）を実施しているコーポレートサイト向けに、トラッキングCookieを発行しない埋め込みコードの作成。",
      },
    ],
    faqs: [
      {
        question: "YouTubeの標準埋め込みコードと何が違うのですか？",
        answer:
          "YouTubeの標準コードは固定ピクセル（width=\"560\" height=\"315\"）のため、スマートフォンの画面幅を超えて横スクロールが発生するトラブルが頻発します。当ツールのコードはCSSで画面幅100%かつ16:9比率を保つレスポンシブ設計となっており、どんな端末でも美しく表示されます。",
      },
      {
        question: "Shorts（YouTubeショート動画）のURLも埋め込めますか？",
        answer:
          "はい。「youtube.com/shorts/VIDEO_ID」のURL形式も自動で判別し、Webサイトに埋め込み可能なiframeコードへと変換します。",
      },
      {
        question: "埋め込んだ動画の画質（解像度）を指定することはできますか？",
        answer:
          "YouTubeの埋め込みプレーヤーは、閲覧ユーザーの通信速度や画面サイズに応じて自動で最適な画質（480p/720p/1080p等）を選択・配信する仕様となっています。",
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
        benchmarkTable={guideData.benchmarkTable}
        proTips={guideData.proTips}
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
