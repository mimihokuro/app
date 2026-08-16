import {
  Grid,
  HStack,
  Stack,
  Text,
  useToast,
  useBreakpointValue,
  ButtonGroup,
  Box,
  Icon,
  CloseButton,
  VStack,
  Divider,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useMemo, useState, useRef } from "react";
import { css } from "@emotion/react";
import NumberInputForm from "../../components/NumberInputForm";
import MainContentsHeading from "../../components/MainContentsHeading";
import ExecuteButton from "../../components/ExecuteButton";
import { FiRefreshCw, FiUploadCloud } from "react-icons/fi";

const CalculateFromWidthAndHeight = () => {
  const [widthSize, setWidthSize] = useState(0);
  const [heightSize, setHeightSize] = useState(0);
  const [resultAspect, setResultAspect] = useState("－");
  const [hasZeroInWidth, setHasZeroInWidth] = useState(false);
  const [hasZeroInHeight, setHasZeroInHeight] = useState(false);

  // 画像アップロード用のステート
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const toast = useToast();
  const toastPosition = useBreakpointValue({
    base: "bottom",
    md: "top",
  });

  const ASPECT_RATIO_ITEMS = useMemo(
    () => [
      {
        id: "width-size",
        label: "横幅（px）",
        type: widthSize,
        func: setWidthSize,
        errorMessage: "横幅の値が0です",
        hasError: hasZeroInWidth,
      },
      {
        id: "height-size",
        label: "縦幅（px）",
        type: heightSize,
        func: setHeightSize,
        errorMessage: "縦幅の値が0です",
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

  // 画像読み込みとアスペクト比の自動計算
  const handleImageLoad = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast({
        title: "無効なファイルです",
        description: "画像ファイル（PNG, JPEG, WebP, GIFなど）を選択してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: toastPosition,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        setWidthSize(w);
        setHeightSize(h);
        setImagePreview(e.target.result);
        setFileName(file.name);

        // 画像サイズからアスペクト比を自動算出
        function gcd(a, b) {
          return b === 0 ? a : gcd(b, a % b);
        }
        const commonDivisor = gcd(w, h);
        const ratioWidth = w / commonDivisor;
        const ratioHeight = h / commonDivisor;

        setResultAspect(`${ratioWidth} : ${ratioHeight}`);

        toast({
          title: "画像を読み込みました",
          description: `サイズ: ${w}px × ${h}px として比率を計算しました。`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: toastPosition,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ドラッグ＆ドロップ用のイベントハンドラー
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageLoad(e.dataTransfer.files[0]);
    }
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
    setImagePreview(null);
    setFileName("");
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
          <MainContentsHeading heading="入力方法を選択" />

          {/* 方法 1: 画像から自動取得 */}
          <Stack gap={2}>
            <Text fontSize="sm" fontWeight="bold" color="primary">
              方法 1：画像ファイルから取得
            </Text>
            <Box
              border="2px dashed"
              borderColor={isDragActive ? "primary" : "colorGray"}
              borderRadius="md"
              p={4}
              textAlign="center"
              bg={isDragActive ? "colorGrayLight" : "transparent"}
              cursor="pointer"
              _hover={{ borderColor: "primary", bg: "colorGrayLightest" }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              transition="all 0.2s"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleImageLoad(e.target.files[0])}
              />
              <VStack gap={1}>
                <Icon as={FiUploadCloud} boxSize={6} color={isDragActive ? "primary" : "colorGrayDark"} />
                <Text fontSize="xs" fontWeight="bold">
                  ここに画像をドラッグ＆ドロップ、またはクリックして選択
                </Text>
                <Text fontSize="10px" color="colorGrayDark">
                  PNG, JPEG, WebP, GIF など (サイズを取得して自動計算します)
                </Text>
              </VStack>
            </Box>

            {imagePreview && (
              <HStack
                p={2}
                bg="colorGrayLightest"
                borderRadius="md"
                borderWidth="1px"
                borderColor="colorGray"
                justify="space-between"
                width="100%"
              >
                <HStack gap={3}>
                  <Box
                    as="img"
                    src={imagePreview}
                    alt="preview"
                    boxSize="36px"
                    objectFit="cover"
                    borderRadius="sm"
                    borderWidth="1px"
                    borderColor="colorGray"
                  />
                  <VStack align="start" gap={0}>
                    <Text fontSize="xs" fontWeight="bold" noOfLines={1} maxW="200px">
                      {fileName}
                    </Text>
                    <Text fontSize="10px" color="colorGrayDark">
                      {widthSize}px × {heightSize}px
                    </Text>
                  </VStack>
                </HStack>
                <CloseButton
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setFileName("");
                  }}
                />
              </HStack>
            )}
          </Stack>

          {/* または セパレーター */}
          <Box position="relative" py={1}>
            <Divider borderColor="colorGray" />
            <AbsoluteCenter bg="colorWhite" px={3} color="colorGrayDark" fontSize="xs" fontWeight="bold">
              または
            </AbsoluteCenter>
          </Box>

          {/* 方法 2: 数値を直接入力 */}
          <Stack gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="primary">
              方法 2：数値を直接入力（px）
            </Text>
            <Stack
              flexDirection={{ base: "column", sm: "row" }}
              placeItems={"start"}
              gap={6}
              width={"100%"}
            >
              {ASPECT_RATIO_ITEMS.map((item) => {
                return (
                  <Stack key={item.id} width="100%">
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
          </Stack>
          <ButtonGroup
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            width={"100%"}
            gap={2}
          >
            <ExecuteButton buttonFunc={calculateAspectRatio} text="計算する" />
            <ExecuteButton
              icon={<FiRefreshCw />}
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
    </Stack>
  );
};

export default CalculateFromWidthAndHeight;
