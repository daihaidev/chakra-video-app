import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import SendMessage from "./mobileSendMessage";
import MobileChatStream from "./mobileChatStream";

interface ChatProps extends BoxProps { };

const MobileChat = ({ ...props }: ChatProps) => {
  return (
    <Box
      {...props}
      display="flex"
      pt="2"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        w="full"
        px="4"
        overflowY="scroll"
        d="flex"
        flexDirection="column-reverse"
        flexGrow={1}
        marginBottom="120px"
      >
        <Box width="calc(100% - 40px)" zIndex={1} top={0} position="absolute" height="80px" background="linear-gradient(0deg,rgba(255, 255, 255, 0) 0%,  rgba(255, 255, 255, 1) 100%)" />
        <Box h="auto">
          <MobileChatStream />
        </Box>
      </Box>
      <Box
        w={props.width}
        position="fixed"
        bottom={-1}
        right="0"
        zIndex="tooltip"
      >
        <SendMessage bg="white" />
      </Box>
    </Box>
  )
};

export default MobileChat;
