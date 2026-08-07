import React from "react";
import { Box, Heading, Text, VStack, UnorderedList, ListItem, Link } from "@chakra-ui/react";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";

const PrivacyPolicy = () => {
  usePageMetadata({
    title: "プライバシーポリシー | EC Tool Crate",
    description: "EC Tool Crateのプライバシーポリシーです。個人情報の取り扱い、Cookieの使用、広告配信（Google AdSense）、アクセス解析ツール、免責事項について定めています。",
    canonicalUrl: "https://ec-tool-crate.com/privacy-policy",
    ogTitle: "プライバシーポリシー | EC Tool Crate",
    ogDescription: "EC Tool Crateのプライバシーポリシーです。",
    ogType: "website",
  });

  return (
    <Box className="max-w-4xl mx-auto font-sans text-notion-text">
      <PageTitle
        pageTitle="🔒 プライバシーポリシー"
        pageDescription="当サイト（EC Tool Crate）における個人情報の保護および取り扱いに関する基本方針です。"
      />

      <VStack gap={8} align="stretch" mt={8} className="text-sm md:text-base leading-relaxed text-notion-text">
        {/* 基本方針 */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            1. 個人情報の管理と保護
          </Heading>
          <Text color="gray.600">
            当サイト（EC Tool Crate）は、ユーザーの個人情報を適切に保護することを重視しています。お問い合わせ等で取得した個人情報（お名前、メールアドレス等）は、問い合わせに対する回答および必要な連絡のみに利用し、法令に基づき開示が求められる場合を除き、第三者に提供・開示することはいたしません。
          </Text>
        </Box>

        {/* 広告配信（Google AdSense）について */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            2. 広告の配信について（Google AdSense）
          </Heading>
          <Text color="gray.600" mb={3}>
            当サイトでは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
          </Text>
          <Text color="gray.600" mb={3}>
            広告配信事業者（Google等）は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」（氏名、住所、メール アドレス、電話番号は含まれません）を使用することがあります。
          </Text>
          <Text color="gray.600" mb={3}>
            また、Googleによるパーソナライズ広告の無効化（オプトアウト）は、
            <Link href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" color="emerald.600" isExternal textDecoration="underline" mx={1}>
              Googleの広告設定ページ
            </Link>
            にて設定可能です。
          </Text>
        </Box>

        {/* アクセス解析ツール（Google Analytics） */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            3. アクセス解析ツールについて
          </Heading>
          <Text color="gray.600" mb={3}>
            当サイトでは、サイトの利用状況やアクセス傾向を把握するため「Google Tag Manager / Google Analytics」等のアクセス解析ツールを使用する場合があります。
          </Text>
          <Text color="gray.600">
            これらはトラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。ブラウザの設定でCookieを無効にすることにより、収集を拒否することが可能です。
          </Text>
        </Box>

        {/* 免責事項 */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            4. 免責事項
          </Heading>
          <UnorderedList spacing={2} color="gray.600" pl={4}>
            <ListItem>
              当サイトで提供している各種計算ツールおよびコンテンツ・情報につきましては、可能な限り正確なロジックおよび情報を提供するよう努めておりますが、計算結果の完全性・正確性・安全性を保証するものではありません。
            </ListItem>
            <ListItem>
              当サイトの計算ツールや掲載内容によって生じた損害・トラブル・不利益について、当サイトおよび運営者は一切の責任を負いかねますので、あらかじめご了承ください。
            </ListItem>
            <ListItem>
              当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報やサービス等について一切の責任を負いません。
            </ListItem>
          </UnorderedList>
        </Box>

        {/* 著作権・リンクについて */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            5. 著作権・リンクについて
          </Heading>
          <Text color="gray.600" mb={3}>
            当サイトの文章、デザイン、プログラムコード等の著作権は当サイト運営者に帰属します。無断転載・複製を禁止いたします。
          </Text>
          <Text color="gray.600">
            当サイトは原則としてリンクフリーです。Webサイトやブログ、SNS等で当サイトへのリンクを掲載する際の許可・連絡は不要です。
          </Text>
        </Box>

        {/* 改定 */}
        <Box p={6} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white">
          <Heading as="h2" size="sm" mb={3} color="gray.800">
            6. プライバシーポリシーの変更
          </Heading>
          <Text color="gray.600">
            当サイトは、法令の制定・改正やサービス内容の変更に伴い、本プライバシーポリシーの内容を適宜見直し、予告なく改定する場合があります。変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
          </Text>
          <Text fontSize="xs" color="gray.400" mt={4}>
            制定日: 2026年7月1日 / 最終更新日: 2026年8月7日
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default PrivacyPolicy;
