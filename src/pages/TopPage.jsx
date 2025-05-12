import "../App.css";
import { Image, Stack, Text, VStack } from "@chakra-ui/react";
import TopContents from "../features/top/TopContents";
import mvImage from "../assets/web-shopping.svg";

function TopPage() {
  return (
    <VStack
      placeItems={"center"}
      border={"1px solid #E6E6E6"}
      gap={{
        base: 8,
        xl: 16,
      }}
    >
      <VStack
        px={{
          base: 4,
          xl: 6,
        }}
        py={12}
        gap={10}
        placeContent={"center"}
        flexDirection={{
          base: "column",
          md: "row-reverse",
        }}
        flexWrap={"wrap"}
      >
        <Image
          flexShrink={2}
          width={"100%"}
          aspectRatio={"400/266"}
          maxWidth={"640px"}
          src={mvImage}
          alt=""
        />
        <Stack gap={4} flexShrink={0}>
          <Stack as="h1" fontSize={{ base: 48, sm: 56 }} fontWeight={500}>
            <Text as="span" fontSize={"30%"}>
              ECサイト運営に役立つツールボックス
            </Text>
            <Text as="span" color={"#0AA864"} lineHeight={1}>
              EC Tool Crate
            </Text>
          </Stack>
          <Text fontSize={{ base: "16px", sm: "14px" }}>
            ECに携わるWebデザイナーや運営者の
            <br />
            日々の業務に役立つツールが続々集結しています。
          </Text>
        </Stack>
      </VStack>
      <VStack
        width={"100%"}
        px={{
          base: 4,
          xl: 6,
        }}
        py={{
          base: 8,
          xl: 20,
        }}
        gap={10}
        backgroundColor={"#E6E6E6"}
      >
        <TopContents />
      </VStack>
    </VStack>
  );
}

export default TopPage;
