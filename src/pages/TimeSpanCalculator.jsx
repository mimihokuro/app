// src/TimeSpanCalculator.js
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Grid,
  HStack,
  Flex,
  Box,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import PageTitle from "../components/PageTitle";
import MainContentsHeading from "../components/MainContentsHeading";
import usePageMetadata from "../hooks/usePageMetadata";
import { InfoIcon } from "@chakra-ui/icons";
import ExecuteButton from "../components/ExecuteButton";

function TimeSpanCalculator() {
  usePageMetadata({
    title: "期間日時計算ツール | EC Tool Crate",
    description:
      "開始日時と終了日時を入力すると、日数と総時間を計算します。例えば、プロジェクトの期間やイベントのスケジュール管理に役立ちます。",
  });

  const today = new Date();
  const [startDate, setStartDate] = useState(
    `${today.getFullYear()}-01-01 00:00`
  );
  const [endDate, setEndDate] = useState(`${today.getFullYear()}-12-31 23:59`);
  const [result, setResult] = useState({ days: 0, hours: 0 }); // 計算結果を保持 (days, hours)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const toast = useToast();

  // 日時が変更されたときのハンドラー
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setResult({ days: 0, hours: 0 }); // 日付が変更されたら結果をリセット
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setResult({ days: 0, hours: 0 }); // 日付が変更されたら結果をリセット
  };

  // 計算を実行する関数
  const calculateDifference = () => {
    setResult({ days: 0, hours: 0 }); // 前の結果をクリア

    // 入力値の検証
    if (!startDate || !endDate) {
      toast({
        title: "期間が無効です",
        description: "開始日時と終了日時を両方入力してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 日付オブジェクトが有効か確認
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast({
        title: "日時が無効です",
        description: "有効な日時を入力してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // 終了日時が開始日時より前でないか確認
    if (end < start) {
      toast({
        title: "期間が無効です",
        description: "終了日時は開始日時より後である必要があります。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // ミリ秒単位で差を計算
    let diffInMilliseconds = end.getTime() - start.getTime();

    // 日数に変換
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    // 時間に変換 (総時間)
    const totalHours = diffInMilliseconds / (1000 * 60 * 60);

    setResult({
      days: days,
      hours: parseFloat(totalHours.toFixed(1)), // 小数点以下2桁に丸める
    });
    toast({
      title: "集計が完了しました",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  return (
    <Stack gap={8}>
      <PageTitle
        pageTitle={"⏳期間日時計算ツール"}
        pageDescription={
          "開始日時と終了日時を入力すると、期間の日数換算と総時間換算を出力します。"
        }
      />
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
          <MainContentsHeading heading="日時選択" />
          {/* 開始日時の入力フォーム */}
          <FormControl id="start-date">
            <FormLabel htmlFor="start" _hover={{ cursor: "pointer" }}>
              開始日時
            </FormLabel>
            <Input
              id="start"
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
              aria-labelledby="期間開始日"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              backgroundColor={"colorWhite"}
              size="lg"
            />
          </FormControl>

          {/* 終了日時の入力フォーム */}
          <FormControl id="end-date">
            <FormLabel htmlFor="end" _hover={{ cursor: "pointer" }}>
              終了日時
            </FormLabel>
            <Input
              id="end"
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
              aria-labelledby="期間終了日"
              variant="filled"
              border={"1px solid"}
              borderColor="colorGray"
              backgroundColor={"colorWhite"}
              size="lg"
            />
          </FormControl>

          <ExecuteButton buttonFunc={calculateDifference} text="集計する" />
        </Stack>
        <Stack
          gap={6}
          p={6}
          border={"1px solid"}
          borderColor="colorGray"
          borderRadius={8}
        >
          <MainContentsHeading heading="集計結果" />
          <HStack flexWrap={"wrap"} gap={4} lineHeight="1">
            <Flex alignItems="end" fontSize={20}>
              <Text as={"span"}>日数：</Text>
              <Text fontSize={36} lineHeight="0.75">
                {result.days}
              </Text>
              <Text as={"span"}>日</Text>
              <Tooltip
                label={
                  <Box p={2} maxWidth="350px" letterSpacing={"0.8px"}>
                    <Text fontWeight="bold" mb={2} fontSize="sm">
                      💡 日数計算についてのお知らせ
                    </Text>
                    <Text fontSize="sm" mb={1}>
                      このツールでは、開始の日時ちょうどから終了の日時ちょうどまでの「実際に経過した時間」を計算しています。
                    </Text>
                    <Text fontSize="sm" mb={1}>
                      例えば、「{`${today.getFullYear()}`}年1月1日
                      0時0分」から「{`${today.getFullYear()}`}年12月31日
                      23時59分」までを指定した場合、経過時間は「364日と23時間59分」となります。これは、丸々365日分の時間には、あと1分足りないためです。
                    </Text>
                    <Text fontSize="sm" mb={1}>
                      そのため、当ツールでは
                      <Text as={"strong"} color={"red.400"}>
                        完了した丸1日の数
                      </Text>
                      として「364日」と表示します。
                    </Text>
                    <Text fontSize="sm">
                      カレンダーで1月1日から12月31日までを数えて「365日間」とするのとは、計算の仕方が少し異なりますのでご注意ください。
                    </Text>
                  </Box>
                }
                hasArrow
                placement="top"
                bg="gray.700"
                color="white"
                borderRadius="md"
                p={0}
                boxShadow="lg"
                isOpen={isInfoTooltipOpen}
                // closeOnClick={false} // isOpenを制御している場合、外部クリックでの自動クローズは効かないことがある
              >
                <InfoIcon
                  ml={1}
                  color="secondary"
                  cursor="pointer"
                  boxSize={4}
                  onClick={() => setIsInfoTooltipOpen(!isInfoTooltipOpen)}
                  aria-label="日数計算の詳細を表示"
                />
              </Tooltip>
            </Flex>
            <Flex alignItems="end" fontSize={20}>
              <Text as={"span"}>総時間：</Text>
              <Text as={"span"} fontSize={36} lineHeight="0.75">
                {result.hours}
              </Text>
              <Text as={"span"}>時間</Text>
            </Flex>
          </HStack>
        </Stack>
      </Grid>
    </Stack>
  );
}

export default TimeSpanCalculator;
