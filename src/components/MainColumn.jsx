import { Image, Stack, Text } from "@chakra-ui/react";
import MainContents from "./MainContentss";
import mvImage from "../assets/web-shopping.svg";

const MainColumn = () => {
  return (
    <Stack
      width={"100%"}
      placeItems={"center"}
      borderLeftRadius={{
        base: "0px",
        sm: "0px",
        md: "32px",
        lg: "32px",
      }}
      overflow={"hidden"}
      backgroundColor={"#E6E6E6"}
      gap={16}
    >
      <Stack
        width={"100%"}
        px={8}
        py={12}
        gap={10}
        placeItems={"center"}
        placeContent={"center"}
        flexDirection={{
          base: "column",
          sm: "column",
          md: "row-reverse",
          lg: "row-reverse",
        }}
        flexWrap={"wrap"}
        backgroundColor={"#ffffff"}
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
            <Text as="span" color={"#0AA864"}>
              EC Tool Crate
            </Text>
          </Stack>
          <Text fontSize={{ base: "16px", sm: "14px" }}>
            ECに携わるWebデザイナーや運営者の
            <br />
            日々の業務に役立つツールが続々集結しています。
          </Text>
        </Stack>
      </Stack>
      <Stack px={6} pb={16} gap={10}>
        <MainContents />
      </Stack>
    </Stack>
  );
};

export default MainColumn;
