import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [badInputFlag, setBadInputFlag] = useState(false);
  const [resultAspect, setResultAspect] = useState("-");

  const ASPECT_RATIO_ITEMS = [
    {
      label: "幅",
      val: widthSize,
      func: setWidthSize,
    },
    {
      label: "高さ",
      val: heightSize,
      func: setHeightSize,
    },
  ];

  const inputNum = (func) => (e) => {
    if (badInputFlag) {
      setBadInputFlag(false);
    }
    const value = parseInt(e.target.value, 10);
    func(isNaN(value) ? 0 : value);
  };

  const calculateAspectRatio = () => {
    if (heightSize <= 0 || widthSize <= 0) {
      setBadInputFlag(true);
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
          <HStack
            flexWrap={"wrap"}
            placeItems={"center"}
            gap={6}
            width={"100%"}
          >
            {ASPECT_RATIO_ITEMS.map((item) => {
              return (
                <Stack key={item.label}>
                  <Text>{item.label}</Text>
                  <Input
                    value={item.val}
                    label={item.label}
                    onChange={inputNum(item.func)}
                    borderColor="#aaaaaa"
                    focusBorderColor="teal.400"
                  />
                </Stack>
              );
            })}
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="primary"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculateAspectRatio}
          >
            計算実行
          </Button>
          {badInputFlag && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                幅もしくは高さに0が入力されています
              </AlertDescription>
            </Alert>
          )}
        </VStack>
        <Text
          fontWeight="bold"
          fontSize={24}
          textAlign={"center"}
          transform={"rotate(180deg)"}
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
          <Text variant="subtitle1" fontSize={24} lineHeight="1">
            縦横比率
          </Text>
          <Text variant="subtitle1" fontSize={24} lineHeight="1">
            {resultAspect}
          </Text>
        </HStack>
      </Grid>
    </>
  );
};

export default CalculateFromWidthAndHeight;
