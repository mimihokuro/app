import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Grid,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";

const ASPECT_OPTIONS = [
  { label: "黄金比（1:1.618）", value: "1" },
  { label: "白銀比（1:1.414）", value: "2" },
  { label: "16:9", value: "3" },
  { label: "4:3", value: "4" },
  { label: "任意", value: "5" },
];

const HeightFromRatioAndWidth = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [isSelectedOption, setIsSelectedOption] = useState("1");
  const [badInputFlag, setBadInputFlag] = useState(false);
  const [widthRatio, setWidthRatio] = useState(0);
  const [heightRatio, setHeightRatio] = useState(0);
  const [optionalRatioFlag, setOptionalRatioFlag] = useState(false);

  const inputNum = (func) => (e) => {
    if (badInputFlag) {
      setBadInputFlag(false);
    }
    const value = parseInt(e.target.value, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleOptionChange = (value) => {
    if (value === "5") {
      setOptionalRatioFlag(true);
    } else {
      setOptionalRatioFlag(false);
      setWidthRatio(0);
      setHeightRatio(0);
    }
    setIsSelectedOption(value);
  };

  const calculateHeight = () => {
    if (isSelectedOption === "1") {
      setHeightSize((widthSize * 1.618).toFixed(2));
    } else if (isSelectedOption === "2") {
      setHeightSize((widthSize * 1.414).toFixed(2));
    } else if (isSelectedOption === "3") {
      setHeightSize((widthSize / 16) * 9);
    } else if (isSelectedOption === "4") {
      setHeightSize((widthSize / 4) * 3);
    } else if (isSelectedOption === "5") {
      if (widthRatio > 0 && heightRatio > 0) {
        setHeightSize((widthSize / widthRatio) * heightRatio);
      } else {
        alert("無効な比率です。");
      }
    }
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
              <Stack>
                <Text>幅</Text>
                <Input
                  value={widthSize}
                  onChange={inputNum(setWidthSize)}
                  borderColor="#aaaaaa"
                  focusBorderColor="teal.400"
                />
              </Stack>
            </HStack>
            <Stack>
              <Text>計算する比率</Text>
              <RadioGroup
                onChange={handleOptionChange}
                value={isSelectedOption}
              >
                <HStack gap="6">
                  {ASPECT_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
              {optionalRatioFlag && (
                <Stack>
                  <Text>縦横比</Text>
                  <HStack gap={2}>
                    <Input
                      value={widthRatio}
                      onChange={inputNum(setWidthRatio)}
                      borderColor="#aaaaaa"
                      focusBorderColor="teal.400"
                    />
                    <Text>:</Text>
                    <Input
                      value={heightRatio}
                      onChange={inputNum(setHeightRatio)}
                      borderColor="#aaaaaa"
                      focusBorderColor="teal.400"
                    />
                  </HStack>
                </Stack>
              )}
            </Stack>{" "}
          </HStack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="teal.400"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculateHeight}
          >
            計算実行
          </Button>
          {badInputFlag && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>幅に0が入力されています</AlertDescription>
            </Alert>
          )}
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
        <Stack
          flexGrow={1}
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
          <Stack direction="row" alignItems="end" flexWrap="wrap" gap={1}>
            <Text fontSize={24} lineHeight="1">
              幅{widthSize}：高さ
            </Text>
            <Text fontSize={36} lineHeight="0.8">
              {heightSize}
            </Text>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

export default HeightFromRatioAndWidth;
