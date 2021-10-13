import * as React from 'react';
import { Box, Text, Flex, Avatar, Spacer } from "@chakra-ui/react";
import { roomSelector } from '../../../recoil/atoms/room';
import { useRecoilValue } from 'recoil';
import * as Util from "../../../util";
import { OverlayModel } from '../../../recoil/atoms/overlay/types';

const ChatOverlay = ({ id, author, message, published, timestamp }: OverlayModel) => {
  const room = useRecoilValue(roomSelector);
  if (published === false) return null;
  return (
    <Box
      bgColor={room?.branding?.commentBackgroundColor ? room.branding.commentBackgroundColor : 'white'}
      w="100%"
      key={`box-${id}`}
      p="0.30rem"
      borderRadius="0.6rem"
    >
      <Flex textColor="gray">
        <Box>
          <Avatar name={author.name} size="xs" src={author.photo1} />
        </Box>
        <Box pl="0.33rem">
          <Text fontSize="sm">{author.name}</Text>
        </Box>
        <Spacer />
        <Box>
          <Text fontSize="sm">{Util.formatTime(timestamp)}</Text>
        </Box>
      </Flex>
      <Flex textAlign="left"
        px="1.9rem"
        wordBreak="break-word"
        textColor={room?.branding?.commentTextColor ? room.branding.commentTextColor : 'inherit'}
        fontFamily={room?.branding?.commentFontFamily ? room.branding.commentFontFamily : 'inherit'}
      >
        <Text fontSize="sm">{message}</Text>
      </Flex>
    </Box>
  );
};
export default ChatOverlay;