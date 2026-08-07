import React from "react";
import { Box, Heading, Text, VStack, SimpleGrid, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { PiWrench, PiShieldCheck, PiLightning, PiHeart } from "react-icons/pi";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";

const About = () => {
  usePageMetadata({
    title: "当サイトについて (About) | EC Tool Crate",
    description: "EC Tool Crateの運営目的、開発コンセプト、ツールの安全性、運営者情報についての解説ページです。",
    canonicalUrl: "https://ec-tool-crate.com/about",
    ogTitle: "当サイトについて | EC Tool Crate",
    ogDescription: "EC Tool Crateの運営目的・開発コンセプトについての紹介です。",
    ogType: "website",
  });

  const features = [
    {
      icon: PiLightning,
      title: "完全無料で素早い計算",
      description: "会員登録やインストールは不要。ブラウザ上で即座に結果を算出します。",
    },
    {
      icon: PiShieldCheck,
      title: "安心・安全な処理",
      description: "すべての計算処理はサーバーへ送信せず、ブラウザ（JavaScript）内で完結するため、入力データが外部に漏洩することはありません。",
    },
    {
      icon: PiWrench,
      title: "実務に即したツール設計",
      description: "ECサイト運営者、Webデザイナー、マーケターが日々の作業で「欲しかった」と感じるニッチかつ実用的な計算ツールを揃えています。",
    },
    {
      icon: PiHeart,
      title: "シンプルで洗練されたUI",
      description: "Notionライクな直感的でシンプルなデザインで、PC・スマホどちらからでも快適に操作可能です。",
    },
  ];

  return (
    <Box className="max-w-4xl mx-auto font-sans text-notion-text">
      <PageTitle
        pageTitle="ℹ️ 当サイトについて (About)"
        pageDescription="EC Tool Crate は、ECサイト運営やWeb制作、マーケティング業務に携わる方をサポートする便利ツールボックスです。"
      />

      <VStack gap={10} align="stretch" mt={8}>
        {/* 開発の背景・ミッション */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="md" mb={3} color="gray.800">
            当サイトのミッション
          </Heading>
          <Text color="gray.600" leading="relaxed" mb={3}>
            ECサイトの運営やWeb制作の現場では、粗利益率の試算、割引価格の計算、アスペクト比の調整、期間の日数カウントなど、日々小さな計算やツール操作が繰り返し発生します。
          </Text>
          <Text color="gray.600" leading="relaxed">
            「EC Tool Crate」は、そうした手作業の手間を減らし、業務を少しでもスピーディかつ正確に進められるように開発された無料オンラインツール集です。EC関係者だけでなく、Webデザイナーや開発者、日々の数値管理を行うすべての方にご活用いただけるツールを目指しています。
          </Text>
        </Box>

        {/* 特長 */}
        <Box>
          <Heading as="h2" size="md" mb={4} color="gray.800">
            EC Tool Crate 4つのこだわり
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Card key={idx} variant="outline" borderColor="#e9e9e7" bg="white" shadow="sm">
                  <CardHeader pb={2} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl flex-shrink-0">
                      <IconComp />
                    </div>
                    <Heading size="xs" color="gray.800">
                      {item.title}
                    </Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Text fontSize="sm" color="gray.600">
                      {item.description}
                    </Text>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>

        {/* 運営者情報 */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="md" mb={4} color="gray.800">
            運営者・サイト情報
          </Heading>
          <VStack gap={3} align="stretch" fontSize="sm" color="gray.700">
            <div className="flex border-b border-gray-100 pb-2">
              <span className="w-32 font-bold color-gray-600">サイト名</span>
              <span>EC Tool Crate (ECツールクレート)</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2">
              <span className="w-32 font-bold color-gray-600">サイトURL</span>
              <span>https://ec-tool-crate.com</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2">
              <span className="w-32 font-bold color-gray-600">サイトの目的</span>
              <span>EC運営・Web制作・マーケティングに役立つWebツールの開発および無料提供</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2">
              <span className="w-32 font-bold color-gray-600">運営形態</span>
              <span>個人開発・WEBツール事業</span>
            </div>
            <div className="flex pb-1">
              <span className="w-32 font-bold color-gray-600">お問い合わせ</span>
              <span>当サイトのお問い合わせフォームよりお願いいたします。</span>
            </div>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default About;
