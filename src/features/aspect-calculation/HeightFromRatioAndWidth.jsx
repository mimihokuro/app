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
import ToolUsageGuide from "../../components/ToolUsageGuide";

const aspectRatioToolData = {
  toolName: "アスペクト比計算ツール",
  description:
    "横幅もしくは縦幅の数値を入力して、計算したい比率を指定するだけで、簡単にアスペクト比を計算できます。",
  steps: [
    {
      title: "基準の数値を入力",
      description: "基準としたい横幅、もしくは縦幅の数値を入力します。",
    },
    {
      title: "計算したい比率を選択",
      description:
        "入力した数値に対して、計算したい比率を選択します。（比率は横：縦での計算となります）",
    },
    {
      title: "自動で計算",
      description:
        "「計算する」ボタンをクリックすると、計算結果が表示されます。",
    },
  ],
  example: {
    title: "具体的な計算例",
    scenario:
      "例えば、横幅が「1280px」の画像に対して、「16:9」の比率で縦幅の数値を計算したい場合...",
    inputs: [
      { label: "基準となる入力値", value: "1280", unit: "（px）" },
      { label: "選択する比率", value: "16 : 9", unit: "" },
    ],
    resultDescription: "縦幅は以下のようになります。",
    result: "720（px）",
  },
};

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
    if (widthSize <= 0) {
      setHasZeroValue(true);
      return;
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
      if (widthRatio <= 0 || heightRatio <= 0) {
        if (widthRatio <= 0) {
          setHasZeroOptionWidthValue(true);
        }
        if (heightRatio <= 0) {
          setHasZeroOptionHeightValue(true);
        }
        return;
      } else {
        setHeightSize(((widthSize / widthRatio) * heightRatio).toFixed(0));
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
              id={"w-or-h-size"}
              label={"幅もしくは高さ"}
              value={widthSize}
              errorMessage="値が0です"
              isInvalid={hasZeroValue}
              onChange={handleInputNum(setWidthSize)}
            />
            <Stack>
              <Text fontWeight={"500"}>
                計算する比率（例．入力値：◯＝16：9）
              </Text>
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
      <ToolUsageGuide {...aspectRatioToolData} />
    </Stack>
  );
};

export default HeightFromRatioAndWidth;
