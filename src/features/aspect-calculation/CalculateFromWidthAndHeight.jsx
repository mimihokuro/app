import {
  Button,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [resultAspect, setResultAspect] = useState("-");

  const ASPECT_RATIO_ITEMS = [
    {
      label: "高さ",
      val: heightSize,
      func: setHeightSize,
    },
    {
      label: "幅",
      val: widthSize,
      func: setWidthSize,
    },
  ];

  const calculateAspectRatio = () => {
    if (heightSize <= 0 || widthSize <= 0) {
      setResultAspect("高さもしくは幅が0のため計算できません");
      return;
    } else if (widthSize === "" || heightSize === "") {
      setResultAspect("高さもしくは幅が未入力のため計算できません");
      return;
    }

    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }

    const commonDivisor = gcd(widthSize, heightSize);
    const ratioWidth = widthSize / commonDivisor;
    const ratioHeight = heightSize / commonDivisor;

    setResultAspect(`${ratioWidth} : ${ratioHeight}`);
  };

  return (
    <>
      <Grid
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <VStack gap={6} p={6} backgroundColor="#f5f5f5" borderRadius={4}>
          <HStack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            <HStack alignItems="center">
              {ASPECT_RATIO_ITEMS.map((item) => {
                return (
                  <Stack key={item.label}>
                    <Text>{item.label}</Text>
                    <Input
                      value={item.val}
                      label={item.label}
                      onChange={(e) => item.func(e.target.value)}
                      borderColor="#aaaaaa"
                      focusBorderColor="teal.400"
                    />
                  </Stack>
                );
              })}
            </HStack>
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="teal.400"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculateAspectRatio}
          >
            計算実行
          </Button>
        </VStack>
        <Text
          fontWeight="bold"
          fontSize={24}
          textAlign={"center"}
          css={css`
            @container parent (min-width: 800px) {
              transform: rotate(90deg);
            }

            transform: rotate(180deg);
          `}
        >
          ▲
        </Text>
        <HStack
          borderRadius={8}
          gap={1}
          py={4}
          px={2}
          sx={{
            width: { xs: "100%", sm: "initial" },
            mt: { xs: "2rem", sm: "0" },
            ml: { xs: "0", sm: "2rem" },
          }}
          backgroundColor="#f0f0f0"
          justifyContent="center"
          alignItems="center"
        >
          {heightSize === null || widthSize === null ? (
            <Text variant="subtitle1" fontSize={16} lineHeight="1">
              高さもしくは幅が未入力のため計算できません
            </Text>
          ) : heightSize <= 0 || widthSize <= 0 ? (
            <Text variant="subtitle1" fontSize={16} lineHeight="1">
              高さもしくは幅に0以下が入力されています
            </Text>
          ) : (
            <>
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                縦横比率
              </Text>
              <Text variant="subtitle1" fontSize={24} lineHeight="1">
                {resultAspect}
              </Text>
            </>
          )}
          {/* <Text variant="subtitle1" fontSize={24} lineHeight="1">
            {resultAspect}
          </Text> */}
        </HStack>
      </Grid>
    </>
  );
};

export default CalculateFromWidthAndHeight;
