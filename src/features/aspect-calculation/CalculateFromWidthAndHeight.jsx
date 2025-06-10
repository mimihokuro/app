import {
  Grid,
  HStack,
  Stack,
  Text,
  useToast,
  useBreakpointValue,
  ButtonGroup,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { RepeatIcon } from "@chakra-ui/icons";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [resultAspect, setResultAspect] = useState("－");
  const [hasZeroInWidth, setHasZeroInWidth] = useState(false);
  const [hasZeroInHeight, setHasZeroInHeight] = useState(false);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const ASPECT_RATIO_ITEMS = useMemo(
    () => [
      {
        id: "width-size",
        label: "幅",
        type: widthSize,
        func: setWidthSize,
        errorMessage: "幅の値が0です",
        hasError: hasZeroInWidth,
      },
      {
        id: "height-size",
        label: "高さ",
        type: heightSize,
        func: setHeightSize,
        errorMessage: "高さの値が0です",
        hasError: hasZeroInHeight,
      },
    ],
    [
      widthSize,
      heightSize,
      hasZeroInWidth,
      hasZeroInHeight,
      setWidthSize,
      setHeightSize,
    ]
  );

  const handleInputNum = (func) => (valueString) => {
    setHasZeroInWidth(false);
    setHasZeroInHeight(false);
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const calculateAspectRatio = () => {
    setHasZeroInWidth(false);
    setHasZeroInHeight(false);
    if (widthSize <= 0 || heightSize <= 0) {
      setResultAspect("-");

      if (heightSize <= 0) {
        setHasZeroInHeight(true);
      }
      if (widthSize <= 0) {
        setHasZeroInWidth(true);
      }
      return;
    }

    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }

    const commonDivisor = gcd(widthSize, heightSize);
    const ratioWidth = widthSize / commonDivisor;
    const ratioHeight = heightSize / commonDivisor;

    setResultAspect(`${ratioWidth} : ${ratioHeight}`);
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
    setResultAspect("－");
    setHasZeroInWidth(false);
    setHasZeroInHeight(false);
    toast({
      title: "計算条件をリセットしました",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: toastPosition,
    });
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
          <Stack
            flexDirection={{ base: "column", sm: "row" }}
            placeItems={"start"}
            gap={6}
            width={"100%"}
          >
            {ASPECT_RATIO_ITEMS.map((item) => {
              return (
                <Stack key={item.id}>
                  <NumberInputForm
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    value={item.type}
                    onChange={handleInputNum(item.func)}
                    errorMessage={item.errorMessage}
                    isInvalid={item.hasError}
                  />
                </Stack>
              );
            })}
          </Stack>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton buttonFunc={calculateAspectRatio} text="計算する" />
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
          <HStack alignItems="end" fontSize={24} lineHeight="1">
            <Text fontSize={24} lineHeight="1">
              縦横比率＝
            </Text>
            <Text fontSize={24} lineHeight="1">
              {resultAspect}
            </Text>
          </HStack>
        </Stack>
      </Grid>
    </>
  );
};

export default CalculateFromWidthAndHeight;
