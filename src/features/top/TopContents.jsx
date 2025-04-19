import { Image, Link, Stack, Text } from "@chakra-ui/react";
import greeting from "../../assets/greeting.svg";
import notify from "../../assets/notify.svg";
import shareLink from "../../assets/share-link.svg";
import message from "../../assets/message.svg";
import React from "react";

const CONTENTS = [
  {
    title: "当サイトについて",
    image: greeting,
    alt: "当サイトについて",
    description: [
      {
        type: "text",
        value:
          "『EC Tool Crate』は、ECに携わるWebデザイナーや運営者の日々の業務を手助けすべく、ECサイトの運営に役立つことを目的としたツールボックスです。",
      },
      {
        type: "text",
        value:
          "メインではECに携わる方に使っていただくことをターゲットとしていますが、ECに限らず活用できるツールも用意していますので、ECに携わる方以外にも使っていただけると非常に嬉しいです。",
      },
    ],
  },
  {
    title: "免責事項",
    image: notify,
    alt: "EC Tool Crate",
    description: [
      {
        type: "text",
        value:
          "当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。そのため、掲載された内容によって生じた損害等の一切の責任を負いかねますので、あらかじめご了承ください。その他についてはプライバシーポリシーをご覧ください。",
      },
      {
        type: "link",
        value: "https://mimihokuro.com/privacy-policy/",
        text: "プライバシーポリシー",
      },
    ],
  },
  {
    title: "リンクについて",
    image: shareLink,
    alt: "EC Tool Crate",
    description: [
      {
        type: "text",
        value:
          "当サイトは基本的にリンクフリーです。リンクを行う場合の許可や連絡は不要です。",
      },
    ],
  },
  {
    title: "お問い合わせ",
    image: message,
    alt: "EC Tool Crate",
    description: [
      {
        type: "text",
        value:
          "お問い合わせは下記の運営者サイトの問い合わせフォームよりお願いいたします。「こんなツールがほしい」や「今のツールにこんな機能を追加してほしい」、「ここバグってる」などご要望やご意見もぜひぜひお寄せください。",
      },
      {
        type: "link",
        value: "https://mimihokuro.com/contact/",
        text: "問い合わせフォーム",
      },
    ],
  },
];

const TopContents = () => {
  return CONTENTS.map((content) => (
    <Stack
      key={content.title}
      backgroundColor="#ffffff"
      maxWidth={"640px"}
      width={"100%"}
      px={8}
      py={6}
      textAlign={"left"}
      gap={4}
      rounded={"md"}
      lineHeight={1.8}
    >
      <Text as={"h2"} fontSize={20} fontWeight={"600"}>
        {content.title}
      </Text>
      <Stack
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        py={10}
        backgroundColor={"#F3F3F3"}
        rounded={"lg"}
      >
        <Image
          src={content.image}
          width={{ base: "80%", sm: "80%", md: "50%", lg: "50%" }}
          alt={content.alt}
        />
      </Stack>
      {content.description.map((desc, index) => (
        <React.Fragment key={index}>
          {desc.type === "text" && (
            <Text as="span" fontSize={16} color={"#555555"}>
              {desc.value}
            </Text>
          )}
          {desc.type === "link" && (
            <Link href={desc.value} isExternal color="blue.500">
              {desc.text}
            </Link>
          )}
        </React.Fragment>
      ))}
    </Stack>
  ));
};

export default TopContents;
