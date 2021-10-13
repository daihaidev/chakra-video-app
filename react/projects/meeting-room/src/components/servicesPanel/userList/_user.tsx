import * as React from 'react';
import { ListItem, Avatar, Text, Stack, IconButton, HStack, Spacer } from "@chakra-ui/react";
import { FaMicrophoneSlash, FaMicrophone, FaVideoSlash, FaVideo } from "react-icons/fa";
import { IoMdHand } from "react-icons/io";
import { useRecoilValue } from 'recoil';
import { usersSelector } from '../../../recoil/atoms/users';

interface UserProps {
  userId: string;
}

export const User = ({ userId }: UserProps) => {

  const user = useRecoilValue(usersSelector(userId));
  console.log("PARTICIPANTS LIST - user = ", user);

  let micDisplay = user.micEnabled ? <FaMicrophone size="1.3em" /> : <FaMicrophoneSlash size="1.3em" />;
  let camDisplay = user.camEnabled ? <FaVideo size="1.3em" /> : <FaVideoSlash size="1.3em" />;
  let handRaisedDisplay = user.handUp === true ? <IoMdHand size="1.3em" color="#FFD700" /> : null;
  if (user.isModerator) {
    micDisplay = user.micEnabled ? <IconButton variant="ghost" aria-label="Mic Enabled" icon={<FaMicrophone size="1.3em" />} /> : <IconButton variant="ghost" aria-label="Mic Disabled" icon={<FaMicrophoneSlash size="1.3em" />} />;
    camDisplay = user.camEnabled ? <IconButton variant="ghost" aria-label="Camera Enabled" icon={<FaVideo size="1.3em" />} /> : <IconButton variant="ghost" aria-label="Camera Disabled" icon={<FaVideoSlash size="1.3em" />} />;
  }
  return (
    <ListItem bg="gray.100" w="100%" p="0.5rem" color="blackAlpha.800" key={user.id} borderRadius="5px">
      <Stack direction="row" align="center" key={user.id}>
        <Avatar name={user.name} ml="0.3rem" size="sm" src={user.photo1} />
        <Text fontSize="sm" fontWeight="400">{user.name}</Text>
        <Spacer />
        <HStack pr="0.5rem" color="gray.500">
          {handRaisedDisplay}
          {micDisplay}
          {camDisplay}
        </HStack>
      </Stack>
    </ListItem>
  );
};