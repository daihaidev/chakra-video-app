import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { ChatList } from './_chatList';

export const ChatScreen = () => {
  const screenRef = React.useRef<HTMLDivElement>(null);
  return (
    <Box
      ref={screenRef}
      h="calc(100vh - 64px - 100px)"
      w="100%"
      bg="gray.100"
      p="1rem"
      overflowX="hidden"
      overflowY="auto"
      scrollbarwidth='thin'
      style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}
      borderRadius="0.375rem"
    >
      <ChatList screenRef={screenRef} />
    </Box>
  );
};