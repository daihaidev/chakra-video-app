import * as React from "react";
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Avatar,
  Center,
  Text
} from "@chakra-ui/react";
import { roomSelector } from '../../../recoil/atoms/room';
import { useRecoilValue } from 'recoil';

const closeMe = () => {
  setTimeout(() => window.open('', '_self')?.close(), 200);
  //document.getElementsByTagName('html')[0].remove();
}

export const NotFound = () => {

  const room = useRecoilValue(roomSelector);

  return (
    <Flex
      minH="calc(100vh - 64px)"
      align={"center"}
      justify={"center"}
      bgColor={room?.branding?.roomBackgroundColor ? room.branding.roomBackgroundColor : "gray.100"}
      bgImage={room?.branding?.roomBackgroundImage ? `url(${room.branding.roomBackgroundImage})` : "none"}
      bgSize="cover"
      bgRepeat="no-repeat"
      pos="absolute"
      left="0"
      top="64px"
      w="100%"
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={4} width="100%">
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"lg"}
          py={8}
          px={8}
          w={['100%', 400]}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stack spacing={4}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"} align={"center"}>Error: 404 😕</Heading>
              <Text fontSize={"lg"} color={"gray.600"}>
                Invalid Room URL
            </Text>
            </Stack>

            <Center>
              <Avatar bg="blackAlpha.900" />
            </Center>
            <br />
            <Button
              bg="#1ac541"
              color={"white"}
              _hover={{
                bg: "#17a939",
              }}
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>

            <Button
              bg="#ff0000"
              color={"white"}
              _hover={{
                bg: "red.600",
              }}
              onClick={closeMe}
            >
              Close
            </Button>

          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default NotFound;
