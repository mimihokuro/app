import {
  ButtonGroup,
  Grid,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

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

const WidthFromRatioAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [isSelectedOption, setIsSelectedOption] = useState("1");
  const [widthRatio, setWidthRatio] = useState(0);
  const [heightRatio, setHeightRatio] = useState(0);
  const [hasZeroValue, setHasZeroValue] = useState(false);
  const [hasZeroOptionWidthValue, setHasZeroOptionWidthValue] = useState(false);
  const [hasZeroOptionHeightValue, setHasZeroOptionHeightValue] =
    useState(false);
  const [optionalRatioFlag, setOptionalRatioFlag] = useState(false);

  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const handleInputNum = (func) => (valueString) => {
    setHasZeroValue(false);
    setHasZeroOptionWidthValue(false);
    setHasZeroOptionHeightValue(false);
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const handleOptionChange = (value) => {
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
    if (heightSize <= 0) {
      setHasZeroValue(true);
      return;
    }
    if (isSelectedOption === "1") {
      setWidthSize((heightSize / 1.618).toFixed(3));
    } else if (isSelectedOption === "2") {
      setWidthSize((heightSize * 1.618).toFixed(3));
    } else if (isSelectedOption === "3") {
      setWidthSize((heightSize / 1.414).toFixed(3));
    } else if (isSelectedOption === "4") {
      setWidthSize((heightSize * 1.414).toFixed(3));
    } else if (isSelectedOption === "5") {
      // 16:9 の計算式を修正
      setWidthSize(((heightSize / 9) * 16).toFixed(3));
    } else if (isSelectedOption === "6") {
      // 9:16 の計算式を修正
      setWidthSize(((heightSize / 16) * 9).toFixed(3));
    } else if (isSelectedOption === "7") {
      // 4:3 の計算式を修正
      setWidthSize(((heightSize / 3) * 4).toFixed(3));
    } else if (isSelectedOption === "8") {
      // 3:4 の計算式を修正
      setWidthSize(((heightSize / 4) * 3).toFixed(3));
    } else if (isSelectedOption === "9") {
      if (widthRatio <= 0 || heightRatio <= 0) {
        if (widthRatio <= 0) {
          setHasZeroOptionWidthValue(true);
        }
        if (heightRatio <= 0) {
          setHasZeroOptionHeightValue(true);
        }
        return;
      } else {
        setWidthSize(((heightSize / heightRatio) * widthRatio).toFixed(0));
      }
    }
    toast({
      title: "計算が完了しました",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  const resetForm = () => {
    setWidthSize(0);
    setHeightSize(0);
    setIsSelectedOption("1");
    setWidthRatio(0);
    setHeightRatio(0);
    setOptionalRatioFlag(false);
    setHasZeroValue(false);
    setHasZeroOptionWidthValue(false);
    setHasZeroOptionHeightValue(false);

    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
  };

  return (
    <Stack>
      <Grid
        alignItems="start"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={8}
        css={css`
          @container parent (min-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
          }

          grid-template-columns: 1fr;
        `}
      >
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="数値入力" />
          <HStack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            <NumberInputForm
              id={"h-size"}
              label={"縦幅（px）"}
              value={heightSize}
              errorMessage="横幅の値が0です"
              isInvalid={hasZeroValue}
              onChange={handleInputNum(setHeightSize)}
            />
            <Stack>
              <Text fontWeight={"500"}>計算する比率（例．横：縦＝16：9）</Text>
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
                <HStack gap={6} rowGap={4} flexWrap={"wrap"}>
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
                <Heading
                  as={"h3"}
                  pb={2}
                  fontSize={16}
                  borderBottom={"1px solid"}
                  borderBottomColor="colorGray"
                >
                  計算したい比率を入力してください
                </Heading>
                <HStack gap={2} placeItems={"start"}>
                  <NumberInputForm
                    id={"width-ratio"}
                    value={widthRatio}
                    errorMessage="値が0です"
                    isInvalid={hasZeroOptionWidthValue}
                    onChange={handleInputNum(setWidthRatio)}
                  />
                  <Text as={"span"}>:</Text>
                  <NumberInputForm
                    id={"height-ratio"}
                    value={heightRatio}
                    isInvalid={hasZeroOptionHeightValue}
                    errorMessage="値が0です"
                    onChange={handleInputNum(setHeightRatio)}
                  />
                </HStack>
              </Stack>
            )}
          </HStack>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton buttonFunc={calculateHeight} text="計算する" />
            <ExecuteButton
              icon={<RepeatIcon />}
              variant="outline"
              buttonFunc={resetForm}
              text="リセット"
            />
          </ButtonGroup>
        </Stack>
        <Stack
          gap={4}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="計算結果" />
          <Text fontSize={28}>
            {widthSize} : {heightSize}
          </Text>
        </Stack>
      </Grid>
    </Stack>
  );
};

export default WidthFromRatioAndHeight;
