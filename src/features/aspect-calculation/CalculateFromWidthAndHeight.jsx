import { Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import CalculateButton from "../../components/CalculateButton";
import DisplayAlert from "../../components/DisplayAlert";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [badInputFlag, setBadInputFlag] = useState(false);
  const [resultAspect, setResultAspect] = useState("-");

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
    if (badInputFlag) {
      setBadInputFlag(false);
    }
    const value = parseInt(valueString, 10);
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
          <CalculateButton onClick={calculateAspectRatio} />
          {badInputFlag && (
            <DisplayAlert
              status="error"
              message="幅もしくは高さに0が入力されています"
            />
          )}
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
