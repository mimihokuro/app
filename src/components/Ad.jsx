import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// 複数のA8.net広告コードを配列で管理
const ads = [
  {
    id: 1,
    html: `
      <a href="https://px.a8.net/svt/ejp?a8mat=45E6TT+1HL1ZU+3Q2O+BYLJL" rel="nofollow">
        <img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=250924817090&wid=002&eno=01&mid=s00000017376002009000&mc=1" />
      </a>
      <img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=45E6TT+1HL1ZU+3Q2O+BYLJL" alt="" />
    `,
  },
  {
    id: 2,
    html: `
      <a href="https://px.a8.net/svt/ejp?a8mat=45E8DT+9UUE3E+4U8S+61Z81" rel="nofollow">
        <img border="0" width="936" height="120" alt="" src="https://www28.a8.net/svt/bgt?aid=250926833596&wid=002&eno=01&mid=s00000022582001017000&mc=1">
      </a>
      <img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=45E8DT+9UUE3E+4U8S+61Z81" alt="">
    `,
  },
];

const Ad = () => {
  const [currentAd, setCurrentAd] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ads.length);
    setCurrentAd(ads[randomIndex]);
  }, []);

  if (!currentAd) {
    return null;
  }

  return (
    <Box w={"100%"} display="flex" justifyContent="center">
      <Box position="relative" display="inline-block">
        <Text
          position="absolute"
          top="0"
          left="0"
          bg="rgba(0,0,0,0.7)"
          color="white"
          fontSize="xs"
          px={2}
          py={0.5}
          zIndex={2}
          pointerEvents="none"
        >
          PR
        </Text>
        <div dangerouslySetInnerHTML={{ __html: currentAd.html }} />
      </Box>
    </Box>
  );
};

export default Ad;
