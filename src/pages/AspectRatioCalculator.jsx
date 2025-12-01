import { Stack } from "@chakra-ui/react";
import AspectCalculationTypeTabs from "../features/aspect-calculation/AspectCalculationTypeTabs";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import ToolUsageGuideAnchor from "../components/ToolUsageGuideAnchor";
import ToolUsageGuide from "../components/ToolUsageGuide";

const aspectRatioToolData = {
  toolName: "アスペクト比計算ツール",
  description:
    "横幅もしくは縦幅の数値を入力して、計算したい比率を指定するだけで、簡単にアスペクト比を計算できます。",
  steps: [
    {
      title: "計算する数値の種類のタブを選択",
      description:
        "横幅と縦幅から比率を計算したり、横幅と比率から縦幅を計算したり、縦幅と比率から横幅を計算したりすることができます。計算したい数値の種類に合わせてタブを選択してください。",
    },
    {
      title: "数値を入力",
      description:
        "「横幅」もしくは「縦幅」の必要な入力欄に、計算したい数値を入力してください。また、計算したい比率を選択してください。（任意の比率を選択した場合は、比率の数値も入力してください。）",
    },
    {
      title: "「計算する」をクリック",
      description:
        "入力が終わり、「計算する」ボタンをクリックすると、計算結果が表示されます。",
    },
  ],
  example: {
    title: "具体的な計算例",
    scenario:
      "例えば、横幅が「1280px」の画像に対して、「16:9」の比率で縦幅の数値を計算したい場合...",
    inputs: [
      { label: "基準となる入力値", value: "1280", unit: "（px）" },
      { label: "選択する比率", value: "16 : 9", unit: "" },
    ],
    resultDescription: "縦幅は以下のようになります。",
    result: "720（px）",
  },
};

const AspectRatioCalculator = () => {
  usePageMetadata({
    title: "アスペクト比計算ツール | EC Tool Crate",
    description:
      "アスペクト比を簡単に計算できるツールです。幅と高さから縦横比率を計算したり、縦横比率から幅や高さを計算することができます。",
    canonicalUrl: "https://app.mimihokuro.com/aspect-ratio-calculator",
    ogTitle: "アスペクト比計算ツール | EC Tool Crate",
    ogDescription:
      "アスペクト比を簡単に計算できるツールです。幅と高さから縦横比率を計算したり、縦横比率から幅や高さを計算することができます。",
    ogType: "website"
  });

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"📐アスペクト比計算ツール"}
        pageDescription={
          "アスペクト比を簡単に計算できるツールです。幅と高さから縦横比率を計算したり、縦横比率から幅や高さを計算することができます。"
        }
      />
      <ToolUsageGuideAnchor />
      <AspectCalculationTypeTabs />
      <ToolUsageGuide {...aspectRatioToolData} />
    </Stack>
  );
};

export default AspectRatioCalculator;
