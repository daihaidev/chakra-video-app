import React from "react";
import { Box, BoxProps, IconButton, Input, Menu } from "@chakra-ui/react";
import chroma from "chroma-js";
import { FaHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoMdHand } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { SDKContext } from "../../../context/SDKContext";
import { currentUserIdAtom, usersSelector } from "../../../recoil/atoms/users";
import { hasPermission } from "../../../util";
import emojiReactionAnimation from "./reactions/emoji";

interface SendMessageProps extends BoxProps {
  isFullScreen?: boolean
};

const UserType = window.MeetOnline.UserType;
const UserPermission = window.MeetOnline.UserPermission;

const MobileSendMessage = ({ isFullScreen, ...props }: SendMessageProps) => {
  const grayBg = chroma("#0e233e").alpha(0.25).hex()
  const background = chroma.random().hex()

  const meetingClient = React.useContext(SDKContext);
  const currentUserId = useRecoilValue(currentUserIdAtom);
  const currentUser = useRecoilValue(usersSelector(currentUserId));
  const inputTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [text, setText] = React.useState('');

  // TODO: handle form send message
  const sendMessage = () => {
  }

  const raiseHand = () => {
    const handRaised = (currentUser.handUp === true)

    meetingClient?.sendHandRaised(!handRaised);
  }

  const handleChat = () => {
    if (text && text.length > 0) {
      meetingClient?.sendPublicChat(text);
      setText(() => '');
    }
    if (inputTextAreaRef && inputTextAreaRef.current)
      inputTextAreaRef.current.focus();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChat();
    }
  };

  const raiseHandButton = () => {
    return (
      <>
        {(currentUser.type !== UserType.AUDIENCE || hasPermission(currentUser, UserPermission.canRaiseHand)) && (
          <IconButton
            aria-label="Raise hand"
            icon={<IoMdHand />}
            variant="link"
            _active={{
              color: currentUser?.handUp ? 'yellow.400' : isFullScreen ? 'white' : 'brand.800'
            }}
            color={
              currentUser?.handUp ? 'yellow.400' : isFullScreen ? 'white' : 'brand.800'
            }
            fontSize="xl"
            onClick={raiseHand}
          />
        )}
      </>
    )
  };

  return (
    <form onSubmit={sendMessage}>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        maxW="100%"
        {...props}
        py="2"
        w="100%"
        bg={isFullScreen ? grayBg : 'white'}
      >
        {raiseHandButton()}
        <Input
          placeholder="type a message…"
          px="4"
          mr="1"
          border="2px solid"
          borderColor={isFullScreen ? 'brand.100' : 'brand.800'}
          focusBorderColor={isFullScreen ? 'white' : 'brand.800'}
          _hover={{ borderColor: grayBg }}
          color={isFullScreen ? 'white' : 'brand.800'}
          value={text}
          onChange={event => {
            setText(event.target.value)
          }}
          onKeyPress={event => handleKeyPress(event)}
        />
        <IconButton
          aria-label="Send message to chat"
          icon={<FiSend />}
          variant="link"
          color={isFullScreen ? 'white' : 'brand.800'}
          onClick={handleChat}
          fontSize="xl"
        />
        <Menu>
          <IconButton
            aria-label="Send emoji reaction"
            icon={<FaHeart />}
            variant="link"
            color={isFullScreen ? 'white' : 'brand.800'}
            _active={{ color: 'red.400' }}
            fontSize="xl"
            onClick={() =>
              emojiReactionAnimation(background)
            }
          >
            Actions
          </IconButton>
        </Menu>
      </Box>
    </form>
  )
}

export default MobileSendMessage
