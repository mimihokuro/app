import React from "react";
import { Stack } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import HolidayCalculatorFeature from "../features/holiday-calculation/HolidayCalculatorFeature";
import ToolGuideSection from "../components/ToolGuideSection";

const HolidayCalculator = () => {
  usePageMetadata({
    title: "休日・営業日計算ツール（年間休日・実働日数・連休案内生成） | EC Tool Crate",
    description:
      "年間休日数や実働日数の集計はもちろん、GW・お盆・年末年始などの長期連休前における「出荷停止・休業案内メールの自動生成」ができる休日・営業日計算ツールです。",
    canonicalUrl: "https://ec-tool-crate.com/holiday-calculator",
    ogTitle: "休日・営業日計算ツール（年間休日・実働日数・連休案内生成） | EC Tool Crate",
    ogDescription:
      "年間休日数や実働日数の集計、連休前の「出荷停止・休業案内メールの自動生成」ができる休日・営業日計算ツールです。",
    ogType: "website",
  });

  const guideData = {
    title: "休日・営業日計算ツール（年間休日・実働日数 & 連休案内）",
    summary:
      "会社の年間休日・実働日数のカウントに加え、GW・お盆・年末年始などの大型連休前に取引先・バイヤーへ送る「出荷停止・休業スケジュール案内メール」を即座に作成できる実務支援ツールです。",
    logicSteps: [
      {
        title: "実働日数（稼働日）の計算式",
        formula: "実働日数 = 期間総日数 - (カレンダー休日数 + 追加休日数)",
        description:
          "選択した期間（例: 年間365日）から、土日祝日や会社指定の休業日数を差し引いて実質的な営業稼働日数を算出します。",
        example: "年間365日 - (土日祝120日 + 夏季年末年始5日) = 実働 240営業日",
      },
      {
        title: "会社独自の追加休日（特別休暇）の反映",
        formula: "総休日数 = 基本休日数（土日祝等） + 追加休日日数",
        description:
          "夏季休暇、年末年始休暇、創立記念日、有給奨励日などの独自休日を合算し、実態に即した年間休日数を確定します。",
        example: "カレンダー休日120日 ＋ 年末年始・夏季等5日 ＝ 年間休日125日",
      },
      {
        title: "連休出荷スケジュールの案内作成",
        formula: "休業期間 + 最終注文受付日時 + 最終出荷日 + 出荷再開日",
        description:
          "連休前後の物流混雑を防ぐため、取引先・お得意様へ向けた明確な出荷締切・再開スケジュール案内文を生成します。",
        example: "12/29〜1/4休業の場合、12/26注文締切・12/27最終出荷・1/5再開の案内を一括生成",
      },
    ],
    benchmarkTable: {
      title: "【標準カレンダー】年間休日数の目安と業界水準・法定基準",
      headers: ["年間休日数", "内訳・カレンダー条件", "月平均の休日", "実務・業界の傾向"],
      rows: [
        [
          "120日〜125日",
          "完全週休2日（土日104日）＋ 祝日（16日）＋ 夏季・年末年始",
          "約 10日〜11日/月",
          "上場企業・IT・メーカー・公務員の標準。土日祝が完全に休業となる体制。",
        ],
        [
          "105日〜115日",
          "週休2日（土日）＋ 祝日の一部出勤または隔週土曜出勤",
          "約 8.8日〜9.5日/月",
          "労働基準法の法定労働時間（週40時間＝年約2,085時間）を満たす下限目安。",
        ],
        [
          "96日〜104日",
          "週休2日（日祝＋月2〜3日公休）またはシフト制",
          "約 8.0日〜8.6日/月",
          "小売店舗・飲食・年中無休の物流倉庫などに多いシフト制稼働体制。",
        ],
      ],
    },
    proTips: [
      {
        title: "大型連休（GW・お盆・年末年始）は配送リードタイムに余裕を持たせる",
        description:
          "連休前後は各運送会社（ヤマト運輸・佐川急便・日本郵便等）の荷量急増による積み残しや幹線道路の渋滞が発生しやすくなります。連休前納品を確実にするため、通常リードタイム＋1〜2日の前倒し出荷を案内するのがおすすめです。",
      },
      {
        title: "労働基準法上の最低年間休日ライン（105日の壁）に注意する",
        description:
          "法定労働時間は原則『1日8時間・週40時間』です。1日の所定労働時間が8時間の場合、年間労働時間の上限は『365日 ÷ 7日 × 40時間 ＝ 約2,085時間』となり、年間休日数は最低でも105日以上が必要となります。",
      },
      {
        title: "祝日法に基づく振替休日・国民の休日ルール",
        description:
          "祝日が日曜日の場合は翌月曜日が振替休日となりますが、土曜日と重なった場合は振替休日は発生しません。また、祝日に挟まれた平日は『国民の休日』となります。",
      },
    ],
    useCases: [
      {
        title: "お盆・年末年始・GW前の出荷停止案内メールの作成",
        description:
          "連休前の最終受注締切日時や出荷再開日を入力し、取引先向けの一斉周知メールを1クリックで作成。",
      },
      {
        title: "自社の年間休日カレンダー・シフト作成",
        description:
          "新年度の年間休日カレンダー作成や、月別実働日数に基づいた営業日割り売上ノルマのシミュレーションに。",
      },
      {
        title: "転職活動や求人票の休日数チェック",
        description:
          "応募先企業の『年間休日120日』『完全週休2日制』などの労働条件が法的に適正か、実際の出勤日数を照合して確認。",
      },
    ],
    faqs: [
      {
        question: "「年間休日120日」はカレンダー通り休めるということですか？",
        answer:
          "はい。土曜日（52日）＋日曜日（52日）＝104日、さらに国民の祝日（16日）を足すと合計120日になります。そのため年間休日120日は『土日祝日がすべて休み』の標準的な水準です。",
      },
      {
        question: "祝日が土曜日と重なった場合、振替休日は発生しますか？",
        answer:
          "日本の祝日法上、振替休日が発生するのは『祝日が日曜日と重なった場合（翌月曜日が休み）』のみです。土曜日と祝日が重なった場合は振替休日は発生しません。",
      },
      {
        question: "「国民の休日」とは何ですか？",
        answer:
          "祝日法第3条第3項に基づき、『祝日と祝日に挟まれた平日』が自動的に休日となる制度です。例として、敬老の日と秋分の日に挟まれた平日が「国民の休日」となり、シルバーウィークの大型連休が発生します。",
      },
    ],
  };

  return (
    <Stack width="100%" mx="auto" gap={8}>
      <PageTitle
        pageTitle={"🗓️ 休日・営業日計算ツール"}
        pageDescription={
          "年間休日数や実働日数の集計から、GW・お盆・年末年始前の「出荷停止・休業案内メール生成」まで対応した休日・営業日計算ツールです。"
        }
      />

      <HolidayCalculatorFeature />

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
};

export default HolidayCalculator;
