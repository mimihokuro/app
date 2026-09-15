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
} from "react-icons/pi";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";
import GrossProfitMarginCalculator from "../features/gross-profit-calculation/GrossProfitMarginCalculator";

function GrossProfitCalculator() {
  usePageMetadata({
    title:
      "粗利計算ツール（粗利益額・粗利益率）｜手数料・送料を加味した実質手残りシミュレーション | EC Tool Crate",
    description:
      "販売価格と仕入原価から粗利益額・粗利益率を瞬時に自動計算。さらにモールの販売手数料や送料・梱包資材費を引いた「実質手残り額（限界利益）」まで同時に試算できる無料の粗利計算ツールです。",
    canonicalUrl: "https://ec-tool-crate.com/gross-profit-calculator",
    ogTitle: "粗利計算ツール（粗利益額・粗利益率） | EC Tool Crate",
    ogDescription:
      "販売価格と仕入原価から粗利益額・粗利益率、実質手残り額を素早く計算します。",
    ogType: "website",
  });

  // FAQ構造化データ (JSON-LD)
  const faqList = [
    {
      question: "モールの月額システム利用料や広告費はなぜこの計算に入れないのですか？",
      answer:
        "当ツールは「商品が1点売れた瞬間に確実に発生する直接コスト（変動費）」を厳密に把握するためのツールだからです。月額出店料や固定人件費・固定サーバー代などの「固定費」、および全体の「広告宣伝費」は、各商品の『実質手残り額（貢献利益）』の合計から回収する構造になります。まずは商品単位で確実な手残りをプラスに保つことが、店舗全体の黒字化への大前提となります。",
    },
    {
      question: "梱包資材費はどの程度見込んでおくべきですか？",
      answer:
        "商材サイズによりますが、メール便（ネコポス・ゆうパケット等）用の薄型ダンボールやクッション封筒で1枚あたり約20〜40円、60〜80サイズのダンボール箱で約60〜100円、さらにOPP袋・緩衝材・テープ・納品書印刷代などで1件あたり約15〜30円がかかります。一般的には『配送資材・副資材一式で1注文あたり50円〜120円程度』を見込んでおくのが実務上の安全基準です。",
    },
    {
      question: "目標とすべき実質手残り率の目安はどのくらいですか？",
      answer:
        "商材や販売チャネルによって異なりますが、自社ECやオリジナル商品（D2C）では実質手残り率『40%以上』、型番仕入れ商品やモール販売では『20%〜30%前後』が一つの健全な目安です。手残り率が15%を下回ると、予期せぬ返品・配送事故やポイント付与、保管料の発生で容易に赤字転落するリスクが高まります。",
    },
    {
      question: "セール時（ポイント還元やクーポン値引き）の手残りはどう計算すべきですか？",
      answer:
        "セール時は、割引後の販売価格を入力するか、または販売手数料率に『店舗負担ポイント付与率（例: +5%）』や『クーポン原資率』を加算して試算してください。例えば通常10%のモール手数料に加え、店舗負担ポイントを5倍（実質4%増）にする場合は手数料率を『14%』として入力することで、セール時の正確な手残り限界値を把握できます。",
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
        pageTitle={"💰 粗利計算ツール"}
        pageDescription={
          "販売価格と仕入原価から粗利益額・粗利益率を瞬時に計算。さらにモール販売手数料や配送料・梱包資材費を差し引いた「実質手残り（限界利益）」まで自動算出します。"
        }
      />

      {/* ツール本体 */}
      <GrossProfitMarginCalculator />

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
        {/* セクション1: 粗利と実質手残りの違い */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiScales className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>商品単位で計算する「粗利」と「実質手残り（限界利益）」の違い</span>
          </Heading>

          <Stack gap={4} fontSize={{ base: "15px", md: "16.5px" }} color="gray.700" lineHeight="1.8">
            <Text>
              ECサイトやネットショップの運営において、最も多くの事業者が陥りがちな落とし穴が
              <strong>「売上総利益（売上 － 原価）だけで値付けをしてしまうこと」</strong>です。
            </Text>

            <Box p={{ base: 4, md: 5 }} bg="#f9f9f8" borderRadius="xl" borderLeft="4px solid" borderColor="emerald.500">
              <Text fontWeight="bold" color="gray.900" fontSize={{ base: "15px", md: "16.5px" }} mb={1.5}>
                なぜ一般的な「粗利」だけでは危険なのか？
              </Text>
              <Text fontSize={{ base: "14px", md: "15.5px" }} color="gray.600" lineHeight="1.75">
                一般的な会計上の粗利（売上総利益）は「販売価格 － 仕入原価」で算出されます。しかし、現代のEC運営では商品を1点販売するごとに、
                <strong>モールの販売手数料（約8〜15%）</strong>や<strong>決済代行手数料（約3〜4%）</strong>、
                そして<strong>顧客への配送料（約500〜1,000円）やダンボール・緩衝材代</strong>がダイレクトに発生します。
              </Text>
            </Box>

            <Text>
              これら「1個売れるごとに必ず発生する直接コスト（変動費）」を差し引いた後に手元に残る利益こそが、実務上の
              <strong>『実質手残り（限界利益・貢献利益）』</strong>です。
            </Text>

            {/* 比較テーブル */}
            <TableContainer
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              my={3}
            >
              <Table variant="simple" size="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>指標名</Th>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>計算式</Th>
                    <Th color="gray.800" py={3.5} fontSize={{ base: "13px", md: "14px" }}>EC実務における意味合い</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold" color="gray.800" fontSize={{ base: "14px", md: "15px" }}>粗利益（売上総利益）</Td>
                    <Td fontFamily="mono" fontSize={{ base: "13px", md: "14px" }}>販売価格 - 仕入原価</Td>
                    <Td fontSize={{ base: "13px", md: "14.5px" }} color="gray.600">商品そのものの基本利幅。ここから手数料や送料が引かれます。</Td>
                  </Tr>
                  <Tr bg="#f0fdf4">
                    <Td fontWeight="bold" color="emerald.800" fontSize={{ base: "14px", md: "15px" }}>★ 実質手残り（限界利益）</Td>
                    <Td fontFamily="mono" fontSize={{ base: "13px", md: "14px" }} fontWeight="bold" color="emerald.800">
                      販売価格 - 仕入原価 - 手数料 - 送料資材費
                    </Td>
                    <Td fontSize={{ base: "13px", md: "14.5px" }} color="emerald.900" fontWeight="medium">
                      商品1点を売って<strong>口座に実際に残る純現金</strong>。固定費や広告費を回収する原資となります。
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600">
              粗利がいくら高く見えても、実質手残りがマイナス（赤字）であれば、売れれば売れるほど現金を失う「売上はあるのに資金ショートする状態」に陥ってしまいます。
            </Text>
          </Stack>
        </Box>

        {/* セクション2: EC現場でよくある3大計算ミスと対策 */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiWarningCircle className="text-2xl text-amber-500 flex-shrink-0" />
            <span>EC現場でよくある3大計算ミスと対策</span>
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {/* ミス1 */}
            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  ミス 1
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  送料無料設定時の<br />手数料の二重負担
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  「送料別 2,000円（送料700円）」を「送料無料 2,700円」に変更した場合、
                  <strong>送料分の700円に対してもモールの販売手数料（10%＝70円）が追加課金</strong>されます。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> 送料込み価格にする際は、送料実費だけでなく「送料にかかる手数料分」も上乗せして値付けする必要があります。
                </Text>
              </CardBody>
            </Card>

            {/* ミス2 */}
            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  ミス 2
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  税込と税抜の混同による<br />見かけ利益の目減り
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  「税抜原価 1,000円」の商品を「税込 2,000円」で販売した場合、粗利を1,000円と勘違いしがちですが、
                  実際は税抜売上約1,818円に対し原価1,000円のため、<strong>消費税分（約182円）利益が目減り</strong>しています。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> 原価・売価・手数料の税区分（税込/税抜）を揃えて計算する習慣を徹底しましょう。
                </Text>
              </CardBody>
            </Card>

            {/* ミス3 */}
            <Card variant="outline" borderColor="gray.200" bg="white" shadow="sm" borderRadius="xl">
              <CardHeader pb={2}>
                <Badge colorScheme="red" variant="subtle" mb={2.5} fontSize="12px" px={2} py={0.5}>
                  ミス 3
                </Badge>
                <Heading fontSize={{ base: "16px", md: "17px" }} color="gray.900" lineHeight="base">
                  ポイント原資やクーポンを<br />考慮しない価格設定
                </Heading>
              </CardHeader>
              <CardBody pt={0} fontSize={{ base: "14px", md: "14.5px" }} color="gray.700" lineHeight="1.7">
                <Text mb={2.5}>
                  モール独自のキャンペーン（ポイント5倍・10%OFFクーポン）に参加すると、その原資は店舗負担となります。
                  利幅が薄い商品で値引きすると<strong>一発で赤字転落</strong>します。
                </Text>
                <Text color="gray.600" fontSize={{ base: "13px", md: "13.5px" }} bg="gray.50" p={2.5} borderRadius="md" lineHeight="relaxed">
                  💡 <strong>対策:</strong> セール参加時の下限手残りラインを当ツールで事前にシミュレーションしておきましょう。
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        {/* セクション3: 適切な手残り率を確保するための値付けステップ */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "19px", md: "23px" }}
            fontWeight="bold"
            mb={5}
            className="flex items-center gap-2.5 text-notion-text border-b pb-3.5 border-gray-200"
          >
            <PiTrendUp className="text-2xl text-emerald-600 flex-shrink-0" />
            <span>適切な手残り率を確保するための値付けステップ</span>
          </Heading>

          <Stack gap={4} fontSize={{ base: "15px", md: "16.5px" }} color="gray.700" lineHeight="1.8">
            <Text>
              適正な販売価格を決める際は、「原価に適当な利益を乗せる」のではなく、
              <strong>「商品1件あたりの直接コストをすべて積み上げた上で、目標手残り率を逆算する」</strong>のが確実な手順です。
            </Text>

            <VStack gap={3.5} align="stretch">
              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 1</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    直接変動コスト（仕入値・送料・資材費）の確定
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  商品自体の仕入原価に加え、実際に送る際の配送業者運賃（ネコポス/宅配便等）と、ダンボール箱・クッション封筒・テープ・納品書などの副資材費を合計します。
                </Text>
              </Box>

              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 2</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    販売チャネルごとの手数料率（%）を把握
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  出店先（自社EC: 約3.5%、Yahoo!ショッピング: 約6〜8%、楽天市場: 約8〜12%、Amazon: 8〜15%）に応じた販売成約手数料＋決済手数料率を確認します。
                </Text>
              </Box>

              <Box p={{ base: 4, md: 5 }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl">
                <Flex align="center" gap={2.5} mb={1.5}>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={0.5} fontSize="12px">ステップ 3</Badge>
                  <Heading as="h3" fontSize={{ base: "15px", md: "16.5px" }} color="gray.900">
                    目標手残り率（例: 25〜35%）を満たす販売価格の逆算
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} color="gray.600" lineHeight="1.75">
                  当計算ツールを使って販売価格を調整し、実質手残り率が健全なライン（最低20%以上、推奨30%以上）に収まる販売価格を決定します。
                </Text>
              </Box>
            </VStack>
          </Stack>
        </Box>

        {/* セクション4: よくある質問（FAQ） */}
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

export default GrossProfitCalculator;
