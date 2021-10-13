import React from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import MobileMessage from "./mobileMessage"
import useWindowSize from "../../../hooks/useWindowSize";
import { chatIdsSelector } from '../../../recoil/atoms/chats';
import { useRecoilState } from "recoil";
import layoutStates from "../../../recoil/atoms/layout";

interface ChatStreamProps {
  isAnimated?: boolean
  length?: number
};

const MobileChatStream = ({ isAnimated, length }: ChatStreamProps) => {
  const screenSize = useWindowSize();

  const [fullScreen] = useRecoilState(layoutStates.fullScreen);
  const allChatIds = useRecoilValue(chatIdsSelector) as string[];
  const renderedChatIds = allChatIds.slice(0, length);
  //TODO: handle checkout
  const [checkoutMode, setCheckoutMode] = React.useState({
    buyLink: '',
    heading: 'Test Heading'
  });

  const handleClose = () => setCheckoutMode({
    buyLink: '',
    heading: ''
  });

  return (
    <Box>
      {checkoutMode.buyLink && !fullScreen ? (
        <Box>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Heading mb="6">{checkoutMode.heading}</Heading>
            <IconButton
              aria-label={`Close ${checkoutMode.heading} banner`}
              icon={<CloseIcon />}
              onClick={handleClose}
            />
          </Flex>
          <iframe
            src={checkoutMode.buyLink}
            width="100%"
            height={`${screenSize.height}px`}
            title="buy"
          />
        </Box>
      ) : (
        <>
          {renderedChatIds.map((chatId) => {
            return (
              <MobileMessage
                opacity={0.85}
                key={uuidv4()}
                chatId={chatId}
                w="fit-content"
                isAnimated={isAnimated}
                mb="2"
                wordBreak="break-word"
              />
            )
          })}
        </>
      )}
    </Box>
  )
}

export default MobileChatStream
