import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  VStack,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  PiCalculator,
  PiWarningCircle,
  PiTrendUp,
  PiQuestion,
  PiCoins,
  PiCheckCircle,
  PiScales,
  PiPackage,
  PiTable,
} from "react-icons/pi";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import WholesalePriceCalculatorFeature from "../features/wholesale-price-calculator/WholesalePriceCalculatorFeature";

function WholesalePriceCalculator() {
  usePageMetadata({
    title:
      "卸価格計算ツール（掛率・下代・上代）｜ロット別利益試算・早見表付き | EC Tool Crate",
    description:
      "メーカー・問屋・EC事業者向けの卸価格（下代）計算ツール。希望小売価格（上代）と掛率から卸価格と粗利益を瞬時に自動計算。ロット別ボリュームディスカウント試算、目標粗利からの逆算、50%〜75%掛率早見表付き。",
    canonicalUrl: "https://ec-tool-crate.com/wholesale-price-calculator",
    ogTitle: "卸価格計算ツール（掛率・下代・上代） | EC Tool Crate",
    ogDescription:
      "上代と掛率から下代と粗利を即座に計算。ロット別ボリュームディスカウント試算や目標利益からの逆算機能付き。",
    ogType: "website",
  });

  // FAQ構造化データ (JSON-LD)
  const faqList = [
    {
      question: "「6掛け（ろくがけ）」「65掛け」とは何パーセントのことですか？",
      answer:
        "日本の卸商習慣では、1割＝1掛け＝10%を表します。したがって『6掛け』は掛率60%（定価の60%の価格で卸す）、『65掛け』は掛率65%、『55掛け』は掛率55%を意味します。",
    },
    {
      question: "卸価格（下代）の見積書や商談には消費税を含めるべきですか？",
      answer:
        "B2B（企業間取引）では、原則として「税抜単価」で上代・下代・掛率を提示し、請求書発行時に消費税を加算するのが通例です。ただし、小売店がエンドユーザーへ販売する際の参考として「税込定価」を併記しておくと親切です。",
    },
    {
      question: "小売店から「もっと掛率を下げてほしい」と交渉された場合の対策は？",
      answer:
        "単に掛率を下げる（値引きする）のではなく、『1回あたりの発注ロット（数量）を増やすこと』や『送料を着払い（相手負担）にすること』を条件として提示するのが実務上のセオリーです。当ツールの「ロット別試算」を活用して、大口割引しても自社の粗利総額がプラスになる分岐ラインを確認して交渉に臨みましょう。",
    },
    {
      question: "小ロットの卸で送料無料（元払い）にしてはいけない理由は何ですか？",
      answer:
        "例えば1個あたり粗利500円の商品を10個（粗利総額5,000円）卸す際、送料が1,000円かかると利益の20%が吹き飛びます。発注数量が少ない場合は『◯万円未満は送料実費』というミニマムオーダー（MOQ）基準を明確に設定することが利益を守る必須条件です。",
    },
  ];

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Stack gap={10} className="font-sans">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />

      {/* ページヘッダー */}
      <PageTitle
        pageTitle={"📦 卸価格計算ツール"}
        pageDescription={
          "上代（希望小売価格）と掛率から卸価格（下代）や粗利を瞬時に計算。ロット別の数量スライド試算や目標利益からの逆算、掛率早見表もワンクリックで活用できます。"
        }
      />

      {/* ツール本体 */}
      <WholesalePriceCalculatorFeature />

      {/* 実務解説コンテンツエリア */}
      <VStack
        gap={12}
        align="stretch"
        mt={10}
        pt={10}
        borderTop="1px solid"
        borderColor="gray.200"
        className="text-notion-text"
      >
        {/* セクション1: 卸取引の基本用語と計算式 */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiScales className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>卸取引の基本「上代・下代・掛率」の計算式と正しい商習慣</span>
          </Heading>

          <Stack gap={4} fontSize={{ base: "15px", md: "16.5px" }} color="gray.700" lineHeight="1.8">
            <Text>
              メーカー・問屋・EC事業者間で行われるB2B卸取引では、
              <strong>「上代（じょうだい）」「下代（げだい）」「掛率（かけりつ）」</strong>という独自の商習慣用語が使われます。
            </Text>

            <TableContainer border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" my={3}>
              <Table variant="simple" size="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>用語</Th>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>一般的な意味</Th>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>計算式</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold" color="gray.800" fontSize={{ base: "14px", md: "15px" }}>上代（じょうだい）</Td>
                    <Td fontSize={{ base: "13px", md: "14.5px" }} color="gray.700">メーカー希望小売価格（定価・一般消費者向け価格）</Td>
                    <Td fontFamily="mono" fontSize={{ base: "13px", md: "14px" }}>下代 ÷ (掛率 ÷ 100)</Td>
                  </Tr>
                  <Tr bg="#f0fdf4">
                    <Td fontWeight="bold" color="emerald.800" fontSize={{ base: "14px", md: "15px" }}>下代（げだい）</Td>
                    <Td fontSize={{ base: "13px", md: "14.5px" }} color="emerald.900" fontWeight="medium">
                      小売店への卸売単価（卸価格・納入価格）
                    </Td>
                    <Td fontFamily="mono" fontSize={{ base: "13px", md: "14px" }} fontWeight="bold" color="emerald.800">
                      上代 × (掛率 ÷ 100)
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="gray.800" fontSize={{ base: "14px", md: "15px" }}>掛率（かけりつ）</Td>
                    <Td fontSize={{ base: "13px", md: "14.5px" }} color="gray.700">定価に対する卸価格の割合（60%＝6掛け）</Td>
                    <Td fontFamily="mono" fontSize={{ base: "13px", md: "14px" }}>(下代 ÷ 上代) × 100</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <Text>
              卸価格を決める際は、自社の製造原価だけでなく「卸先である小売店が十分な利益（通常30〜50%前後）を得られるか」とのバランスを考慮した価格設計が必須となります。
            </Text>
          </Stack>
        </Box>

        {/* セクション2: 業界・チャネル別の掛率相場一覧 */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiTable className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>【業界・流通チャネル別】一般的な掛率（掛け率）相場一覧</span>
          </Heading>

          <TableContainer border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" my={3}>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.800" py={3.5} fontSize="13px">取引先チャネル</Th>
                  <Th color="gray.800" py={3.5} fontSize="13px">掛率の相場</Th>
                  <Th color="gray.800" py={3.5} fontSize="13px">主な特徴と取引条件</Th>
                  <Th color="gray.800" py={3.5} fontSize="13px">交渉のポイント</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td fontWeight="bold" color="gray.800" fontSize="14px">セレクトショップ・個人小売店</Td>
                  <Td fontWeight="bold" color="green.700" fontSize="14px">60% 〜 70% 掛け</Td>
                  <Td fontSize="13.5px" color="gray.600">小ロット（数点〜数万円単位）での取引が多い。代金回収は前払いまたは売掛。</Td>
                  <Td fontSize="13px" color="gray.600">MOQ（最低発注数）の設定が重要</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" color="gray.800" fontSize="14px">大手百貨店・ファッションビル</Td>
                  <Td fontWeight="bold" color="green.700" fontSize="14px">50% 〜 60% 掛け</Td>
                  <Td fontSize="13.5px" color="gray.600">ブランド認知に寄与するが、消化仕入れ（売れた分だけ仕入れ）や委託条件も。</Td>
                  <Td fontSize="13px" color="gray.600">返品特約の有無を確認</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" color="gray.800" fontSize="14px">量販店・大型チェーンストア (GMS)</Td>
                  <Td fontWeight="bold" color="green.700" fontSize="14px">45% 〜 55% 掛け</Td>
                  <Td fontSize="13.5px" color="gray.600">まとまった大口発注が期待できる反面、リベートやセンターフィーが発生。</Td>
                  <Td fontSize="13px" color="gray.600">大口割引前提での価格設計</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" color="gray.800" fontSize="14px">一次卸問屋（ディストリビューター）</Td>
                  <Td fontWeight="bold" color="green.700" fontSize="14px">40% 〜 50% 掛け</Td>
                  <Td fontSize="13.5px" color="gray.600">全国の小売店へ広く流通させるハブとなるため、最も低い掛率が求められる。</Td>
                  <Td fontSize="13px" color="gray.600">パレット・コンテナ単位の一括納品</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" color="gray.800" fontSize="14px">EC専業ショップ（仕入れ再販）</Td>
                  <Td fontWeight="bold" color="green.700" fontSize="14px">55% 〜 65% 掛け</Td>
                  <Td fontSize="13.5px" color="gray.600">商品画像やスペック情報の提供が求められる。ドロップシッピング対応も。</Td>
                  <Td fontSize="13px" color="gray.600">モール手数料を加味した価格提示</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* セクション3: 卸ビジネスでよくある3大失敗と回避策 */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiWarningCircle className="text-2xl text-amber-500 flex-shrink-0" />
            <span>卸ビジネスでよくある3大失敗と回避策</span>
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  失敗 1
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  小ロットでの送料無料で<br />利益が消滅する
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  卸粗利が数千円しかない小口注文に対し、メーカー元払いで発送すると、<strong>送料だけで利益が吹き飛ぶ</strong>事態に陥ります。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> 「下代合計3万円以上で元払い、未満は送料一律800円」といった下限条件（MOQ）を契約書に明記しましょう。
                </Text>
              </CardBody>
            </Card>

            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  失敗 2
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  自社直販（D2C）との<br />価格競合トラブル
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  自社ECで安売りセールを頻発すると、定価で商品を仕入れて販売してくれている<strong>卸先小売店の不信感と売上低下</strong>を招きます。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> 直販での割引は「限定セット品」や「会員限定クーポン」に留め、オープンな上代価格は守るのが鉄則です。
                </Text>
              </CardBody>
            </Card>

            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  失敗 3
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  売掛金の未回収・<br />支払い遅延リスク
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  新規取引先と十分な与信審査なしに掛け売り（翌月末払い等）を行い、<strong>代金が回収不能になる</strong>トラブルが後を絶ちません。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> 初回取引は「前金（着金後出荷）」、または「Paid等のB2B決済代行保証」を利用しましょう。
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        {/* セクション4: ロット別ボリュームディスカウントの決め方 */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiTrendUp className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>ロット別ボリュームディスカウント（数量スライド）の適切な決め方</span>
          </Heading>

          <Stack gap={4} fontSize={{ base: "15px", md: "16.5px" }} color="gray.700" lineHeight="1.8">
            <Text>
              バイヤーから「まとまった数を買うから安くしてほしい」と打診された際は、
              <strong>「掛率を下げても、1回の取引で得られる粗利総額（キャッシュ）が増えるか」</strong>を基準に判断します。
            </Text>

            <VStack gap={3.5} align="stretch">
              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 1</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    最低発注ロット（ミニマム）の基準設定
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  最も高い掛率（例: 65%〜70%）を適用する小口ロット基準を決め、送料の元払い/着払い区分を確定します。
                </Text>
              </Box>

              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 2</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    段階的な数量スライド条件の設計
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  「10個なら65掛、30個なら60掛、50個なら55掛」のように、発注量が増えるごとに掛率を優遇するプライスリストを作成します。
                </Text>
              </Box>

              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 3</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    当ツールのロット試算で「利益総額」を検算
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  送料や製造コストを差し引いても、大口ロットの方が手元に残る粗利総額が確実に大きくなっているかを検証します。
                </Text>
              </Box>
            </VStack>
          </Stack>
        </Box>

        {/* セクション5: よくある質問（FAQ） */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiQuestion className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>よくある質問（FAQ）</span>
          </Heading>

          <Accordion allowMultiple defaultIndex={[0, 1]} className="border border-gray-200 rounded-xl overflow-hidden">
            {faqList.map((faq, idx) => (
              <AccordionItem key={idx} borderTopWidth={idx === 0 ? 0 : "1px"} borderColor="gray.200">
                <h2>
                  <AccordionButton py={4.5} px={5} _hover={{ bg: "gray.50" }}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="bold" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                      Q. {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={5} px={5} fontSize={{ base: "14px", md: "15.5px" }} color="gray.700" bg="#fafaf9" lineHeight="1.8">
                  A. {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </VStack>
    </Stack>
  );
}

export default WholesalePriceCalculator;
