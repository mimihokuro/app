import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Grid,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const ASPECT_OPTIONS = [
  { label: "黄金比（1 : 1.618）", value: "1" },
  { label: "黄金比（1.618 : 1）", value: "2" },
  { label: "白銀比（1 : 1.414）", value: "3" },
  { label: "白銀比（1.414 : 1）", value: "4" },
  { label: "16 : 9", value: "5" },
  { label: "9 : 16", value: "6" },
  { label: "4 : 3", value: "7" },
  { label: "3 : 4", value: "8" },
  { label: "任意の比率", value: "9" },
];

const HeightFromRatioAndWidth = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [isSelectedOption, setIsSelectedOption] = useState("1");
  const [badSizeInputFlag, setBadSizeInputFlag] = useState(false);
  const [badRatioInputFlag, setBadRatioInputFlag] = useState(false);
  const [widthRatio, setWidthRatio] = useState(0);
  const [heightRatio, setHeightRatio] = useState(0);
  const [optionalRatioFlag, setOptionalRatioFlag] = useState(false);

  const returnInputFlag = () => {
    if (badSizeInputFlag) {
      setBadSizeInputFlag(false);
    }
    if (badRatioInputFlag) {
      setBadRatioInputFlag(false);
    }
  };

  const inputNum = (func) => (valueString) => {
    returnInputFlag();
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleOptionChange = (value) => {
    returnInputFlag();
    if (value === "9") {
      setOptionalRatioFlag(true);
    } else {
      setOptionalRatioFlag(false);
      setWidthRatio(0);
      setHeightRatio(0);
    }
    setIsSelectedOption(value);
  };

  const calculateHeight = () => {
    if (widthSize <= 0) {
      setBadSizeInputFlag(true);
    }
    if (isSelectedOption === "1") {
      setHeightSize((widthSize * 1.618).toFixed(0));
    } else if (isSelectedOption === "2") {
      setHeightSize((widthSize / 1.618).toFixed(0));
    } else if (isSelectedOption === "3") {
      setHeightSize((widthSize * 1.414).toFixed(0));
    } else if (isSelectedOption === "4") {
      setHeightSize((widthSize / 1.414).toFixed(0));
    } else if (isSelectedOption === "5") {
      setHeightSize(((widthSize / 16) * 9).toFixed(0));
    } else if (isSelectedOption === "6") {
      setHeightSize(((widthSize / 9) * 16).toFixed(0));
    } else if (isSelectedOption === "7") {
      setHeightSize(((widthSize / 4) * 3).toFixed(0));
    } else if (isSelectedOption === "8") {
      setHeightSize(((widthSize / 3) * 4).toFixed(0));
    } else if (isSelectedOption === "9") {
      if (widthRatio > 0 && heightRatio > 0) {
        setHeightSize(((widthSize / widthRatio) * heightRatio).toFixed(0));
      } else {
        setBadRatioInputFlag(true);
        return;
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
        <Stack gap={6} p={6} backgroundColor="#f5f5f5" borderRadius={4}>
          <Stack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            <Stack>
              <Text fontWeight={"bold"}>幅もしくは高さ</Text>
              <NumberInput
                value={widthSize}
                onChange={inputNum(setWidthSize)}
                borderColor="#aaaaaa"
                focusBorderColor="primary"
                maxWidth={40}
              >
                <NumberInputField />
              </NumberInput>
            </Stack>
            <Stack>
              <Text fontWeight={"bold"}>計算する比率</Text>
              <RadioGroup
                onChange={handleOptionChange}
                value={isSelectedOption}
                sx={{
                  "& input:checked + span": {
                    backgroundColor: "primary", // チェック時の背景色
                    borderColor: "primary", // チェック時のボーダー色
                  },
                  "& span": {
                    borderColor: "gray.400", // 未チェック時のボーダー色
                  },
                }}
              >
                <HStack gap="6" flexWrap={"wrap"}>
                  {ASPECT_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            </Stack>
            {optionalRatioFlag && (
              <Stack>
                <Text fontWeight={"bold"}>
                  計算したい比率を入力してください
                </Text>
                <HStack gap={2}>
                  <NumberInput
                    value={widthRatio}
                    onChange={inputNum(setWidthRatio)}
                    borderColor="#aaaaaa"
                    focusBorderColor="primary"
                    maxWidth={32}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>:</Text>
                  <NumberInput
                    value={heightRatio}
                    onChange={inputNum(setHeightRatio)}
                    focusBorderColor="primary"
                    borderColor="#aaaaaa"
                    maxWidth={32}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </Stack>
            )}
          </Stack>
          <Stack>
            {badSizeInputFlag && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>幅に0が入力されています</AlertDescription>
              </Alert>
            )}
            {badRatioInputFlag && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>
                  任意の比率に0が入力されています
                </AlertDescription>
              </Alert>
            )}
          </Stack>
          <Button
            fontWeight="bold"
            variant="filled"
            width="100%"
            backgroundColor="primary"
            color="#ffffff"
            sx={{ fontSize: "20px" }}
            onClick={calculateHeight}
          >
            計算実行
          </Button>
        </Stack>
        <Text
          fontWeight="bold"
          fontSize={24}
          textAlign={"center"}
          transform={"rotate(180deg)"}
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
              算出サイズ：
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
