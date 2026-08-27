import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import WholesalePriceCalculation from "../features/wholesale-price-calculator/wholesalePriceCalculation";
import ToolGuideSection from "../components/ToolGuideSection";

function WholesalePriceCalculator() {
  usePageMetadata({
    title: "卸価格計算ツール（掛率・卸単価） | EC Tool Crate",
    description:
      "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を、または仕入原価と目標利益から適切な卸価格を素早く計算します。B2B卸取引や仕入れ交渉に役立つ計算ツールです。",
    canonicalUrl: "https://ec-tool-crate.com/wholesale-price-calculator",
    ogTitle: "卸価格計算ツール（掛率・卸単価） | EC Tool Crate",
    ogDescription:
      "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を素早く計算します。",
    ogType: "website"
  });

  const guideData = {
    title: "卸価格計算ツール",
    summary:
      "メーカー・問屋・EC事業者間のB2B卸取引において必須となる「上代（希望小売価格）」「下代（卸価格）」「掛率（卸率%）」を相互計算するツールです。小売店への卸条件提示、仕入れ原価試算、ロット別の掛け率シミュレーションに幅広くご活用いただけます。",
    logicSteps: [
      {
        title: "卸価格（下代: げだい）の計算",
        formula: "下代 = 上代（希望小売価格） × (掛率 ÷ 100)",
        description: "一般消費者向けの定価（上代）に対し、契約掛率（例: 60%＝6掛け）を乗じて卸売単価を算出します。",
        example: "上代 10,000円、掛率 65%（65掛け）の場合 → 10,000 × 0.65 = 卸価格 6,500円",
      },
      {
        title: "掛率（卸率% / 掛け）の計算",
        formula: "掛率(%) = (下代 ÷ 上代) × 100",
        description: "提示された卸単価と定価から、定価の何割（何掛け）で供給されているかを逆算します。",
        example: "上代 8,000円、下代 4,800円 の場合 → (4,800 ÷ 8,000) × 100 = 掛率 60%（6掛け）",
      },
      {
        title: "上代（希望小売価格）の逆算",
        formula: "上代 = 下代 ÷ (掛率 ÷ 100)",
        description: "「卸価格3,000円、掛率60%」で商品を仕入れた場合、想定すべき定価（上代）を算出します。",
        example: "下代 3,000円、掛率 60% の場合 → 3,000 ÷ 0.6 = 上代 5,000円",
      },
    ],
    benchmarkTable: {
      title: "【業界・商流別】一般的な掛率（掛け率）の相場一覧",
      headers: ["取引先形態 / 流通チャネル", "一般的な掛率相場", "取引条件・主な特徴", "値引き・ロット条件"],
      rows: [
        [
          "個人商店・小規模セレクトショップ",
          "60% 〜 70% 掛け",
          "小ロット（数点〜数万円単位）での取引が多く、代金回収は前払いまたは売掛30日。",
          "下代が高め設定になりやすい",
        ],
        [
          "大手百貨店・専門店（消化仕入れ含む）",
          "50% 〜 60% 掛け",
          "ブランド認知向上に寄与するが、返品条件（委託販売）や販売員派遣費がかかる場合あり。",
          "返品特約の有無で掛率が変動",
        ],
        [
          "量販店・大型チェーンストア (GMS)",
          "45% 〜 55% 掛け",
          "大ロット発注が期待できる反面、リベート要求やセンターフィー、特売協賛金が発生。",
          "大口割引前提での価格設計が必要",
        ],
        [
          "一次卸（大問屋・ディストリビューター）",
          "40% 〜 50% 掛け",
          "全国の小売店へ広く流通させるハブとなるため、最も低い掛率が求められる。",
          "コンテナ・パレット単位での一括納品",
        ],
        [
          "EC専業ショップ（仕入れ販売）",
          "55% 〜 65% 掛け",
          "画像素材や商品説明の提供が条件となることが多く、ドロップシッピング対応も。",
          "モール手数料を考慮した価格提示",
        ],
      ],
    },
    proTips: [
      {
        title: "「送料負担区分（元払い・着払い）」の明確化が利益を守る鍵",
        description:
          "卸取引では『注文金額◯万円以上で送料無料（元払い）、未満は送料実費（着払い）』という下限ライン（ミニマムオーダー）を設定するのが標準です。小ロットの卸で送料無料にしてしまうと、送料だけで卸利益が吹き飛ぶリスクがあります。",
      },
      {
        title: "支払いサイト（回収条件）と貸し倒れリスクの管理",
        description:
          "掛け売り（請求書払い・翌月末払いなど）を行う際は、取引先の与信審査や保証サービスの利用を検討しましょう。初めての取引先には『初回前金（着金後出荷）』または『Paid等の決済代行サービス』を利用するのが実務上の安全策です。",
      },
      {
        title: "自社ECでの直販価格（D2C）との価格競合に注意",
        description:
          "自社公式サイトで定価より安くセール販売しすぎると、商品を定価で仕入れてくれている卸先・小売店からの信頼を損ねる原因になります。直販でのクーポン発行時も卸先への配慮あるプライシング設計が不可欠です。",
      },
    ],
    useCases: [
      {
        title: "新規取引先への卸価格一覧（プライスリスト）作成",
        description:
          "自社ブランド商品をバイヤーやセレクトショップに提案する際、掛率に応じた下代一覧表の作成に。",
      },
      {
        title: "仕入れ交渉時の利益率シミュレーション",
        description:
          "メーカーや輸入元から提示された掛率に対し、自社店舗の送料・人件費を引いても目標粗利が確保できるかの検算に。",
      },
      {
        title: "ロット別（数量スライド）卸価格の設計",
        description:
          "「10個なら65掛け、50個なら60掛け、100個なら55掛け」といったボリュームディスカウントの設計に。",
      },
      {
        title: "OEM・PB（プライベートブランド）の受託製造見積もり",
        description:
          "他社ブランドの受託生産において、相手先の希望上代から逆算した製造上限コストの試算に。",
      },
    ],
    faqs: [
      {
        question: "「上代（じょうだい）」と「下代（げだい）」の由来・意味は何ですか？",
        answer:
          "江戸時代の商習慣に由来し、上流（消費者向け）の価格を「上代（定価・メーカー希望小売価格）」、下流（仕入れ段階）の価格を「下代（卸価格・仕入れ単価）」と呼びます。",
      },
      {
        question: "「掛率（かけりつ）」の呼び方はどう表現されますか？",
        answer:
          "60%は「6掛け（ろくがけ）」、65%は「65掛け（ろくじゅうごがけ）」、70%は「7掛け（なながけ）」と呼びます。1割＝1掛け＝10%です。",
      },
      {
        question: "卸価格（下代）には消費税を含めますか？",
        answer:
          "B2B（企業間）の商談や見積書では、原則として「税抜き単価」で上代・下代・掛率を提示し、請求時に消費税を加算するのが通例です。",
      },
    ],
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📦 卸価格計算ツール"}
        pageDescription={
          "希望小売価格（上代）と掛率（卸率）から卸価格（下代）を、または卸価格と上代から掛率を計算します。"
        }
      />
      <WholesalePriceCalculation />
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

export default WholesalePriceCalculator;
