import { Grid, HStack, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import DisplayAlert from "../../components/DisplayAlert";
import ExecuteButton from "../../components/ExecuteButton";

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

  const handleInputNum = (func) => (valueString) => {
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
              onChange={handleInputNum(setWidthSize)}
            />
            <Stack>
              <Text fontWeight={"500"}>計算する比率</Text>
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
                <Text fontWeight={"500"}>計算したい比率を入力してください</Text>
                <HStack gap={2}>
                  <NumberInputForm
                    id={"width-ratio"}
                    value={widthRatio}
                    onChange={handleInputNum(setWidthRatio)}
                  />
                  <Text as={"span"}>:</Text>
                  <NumberInputForm
                    id={"height-ratio"}
                    value={heightRatio}
                    onChange={handleInputNum(setHeightRatio)}
                  />
                </HStack>
              </Stack>
            )}
          </HStack>
          <Stack>
            {badSizeInputFlag && (
              <DisplayAlert status="error" message="幅に0が入力されています" />
            )}
            {badRatioInputFlag && (
              <DisplayAlert
                status="error"
                message="任意の比率に0が入力されています"
              />
            )}
          </Stack>
          <ExecuteButton buttonFunc={calculateHeight} text="計算する" />
        </Stack>
        <Stack
          gap={4}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="計算結果" />
          <HStack alignItems="end" fontSize={24} lineHeight="1">
            <Text as={"span"}>算出サイズ：</Text>
            <Text as={"span"}>{heightSize}</Text>
          </HStack>
        </Stack>
      </Grid>
    </>
  );
};

export default HeightFromRatioAndWidth;
