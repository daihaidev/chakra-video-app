import * as React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Avatar,
  Center
} from "@chakra-ui/react";
import { currentUserNameAtom } from '../../../recoil/atoms/users';
import { roomSelector } from '../../../recoil/atoms/room';
import { joinButtonLoadingSelector } from '../../../recoil/atoms/joinButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SDKContext } from '../../../context/SDKContext';

export const Home = () => {

  const meetingClient = React.useContext(SDKContext);
  const [currentUserName, setCurrentUserName] = useRecoilState(currentUserNameAtom);
  const [isNameValid, setNameValid] = React.useState(true);
  const [loading, setLoading] = useRecoilState(joinButtonLoadingSelector);
  const room = useRecoilValue(roomSelector);

  const joinMeeting = () => {
    console.log("joinMeeting --- currentUserName = " + currentUserName);
    if (!currentUserName) {
      setNameValid(false);
      return;
    }

    if (meetingClient) {
      setLoading(true);
      meetingClient?.setUserName(currentUserName);
      setNameValid(true);
      meetingClient?.connectGateway();
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      joinMeeting();
    }
  }

  console.log("room?.branding?.roomBackgroundImage = " + room?.branding?.roomBackgroundImage);

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
      overflowY="auto"
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
              <Heading fontSize={"4xl"} align={"center"}>{room?.name}</Heading>
              <Text fontSize={"lg"} color={"gray.600"}>
                Please enter your name
            </Text>
            </Stack>

            <Center>
              <Avatar bg="blackAlpha.900" />
            </Center>
            <br />
            <FormControl id="userNameId" isInvalid={!isNameValid}>
              <Input
                type="text"
                placeholder="Your Name"
                _focus={{ borderColor: "orange.500" }}
                value={currentUserName}
                onChange={(event) => setCurrentUserName(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event)}
              />
              <FormErrorMessage>A screen name is required</FormErrorMessage>
            </FormControl>
            <Button
              isLoading={loading}
              loadingText="Joining..."
              bg="#1ac541"
              color="white"
              _hover={{
                bg: "#17a939",
              }}
              onClick={() => joinMeeting()}
            >
              Join Meeting
              </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
export default Home;
