import React from 'react';
import { Box, BoxProps, Link, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { chatsSelector } from '../../../recoil/atoms/chats';
import { roomSelector } from '../../../recoil/atoms/room';

interface MessageProps extends BoxProps {
  chatId: string
  isAnimated?: boolean
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const MobileMessage = ({ chatId, isAnimated, ...props }: MessageProps) => {
  const [chat] = useRecoilState(chatsSelector(chatId));
  const { author, message } = chat;
  const room = useRecoilValue(roomSelector);

  return chat ? (
    <Box
      as={motion.div}
      variants={variants}
      padding="2"
      rounded="lg"
      whileHover={isAnimated ? { scale: 1.1 } : null}
      boxShadow="md"
      key={uuidv4()}
      w="fit-content"
      bg={room?.branding?.commentBackgroundColor ? room.branding.commentBackgroundColor : 'white'}
      {...props}
    >
      <Box>
        <Text textStyle="chatMessage">{message}</Text>
        <Link textStyle="bodyStrong">@{author.name}</Link>
      </Box>
    </Box>
  ) : null
};

export default MobileMessage;
