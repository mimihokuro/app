import { Grid, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [resultAspect, setResultAspect] = useState("-");
  const toast = useToast();

  const ASPECT_RATIO_ITEMS = [
    {
      id: "width-size",
      label: "幅",
      type: widthSize,
      func: setWidthSize,
    },
    {
      id: "height-size",
      label: "高さ",
      type: heightSize,
      func: setHeightSize,
    },
  ];

  const handleInputNum = (func) => (valueString) => {
    const value = parseInt(valueString, 10);
    func(isNaN(value) ? 0 : value);
  };

  const calculateAspectRatio = () => {
    if (heightSize <= 0 || widthSize <= 0) {
      toast({
        title: "幅もしくは高さに0が入力されています",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
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
      position: "bottom",
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
          <HStack flexWrap={"wrap"} placeItems={"start"} gap={6} width={"100%"}>
            {ASPECT_RATIO_ITEMS.map((item) => {
              return (
                <NumberInputForm
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  value={item.type}
                  onChange={handleInputNum(item.func)}
                />
              );
            })}
          </HStack>
          <ExecuteButton buttonFunc={calculateAspectRatio} text="計算する" />
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
