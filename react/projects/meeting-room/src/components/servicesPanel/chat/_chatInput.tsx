import * as React from 'react';
import { Textarea, IconButton, HStack } from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";
import { IoMdHand } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import { SDKContext } from "../../../context/SDKContext";
import { currentUserIdAtom, usersSelector } from '../../../recoil/atoms/users';
import { hasPermission } from '../../../util';
import { heartAnimationSelector } from '../../../recoil/atoms/heartAnimation';
import { useRecoilValue } from 'recoil';

const UserType = window.MeetOnline.UserType;
const UserPermission = window.MeetOnline.UserPermission;

export const ChatInput = () => {
  const meetingClient = React.useContext(SDKContext);

  const isHeartAnimating = useRecoilValue(heartAnimationSelector);

  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));

  const inputTextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState('');

  const handleChat = () => {
    if (text && text.length > 0) {
      meetingClient?.sendPublicChat(text);
      setText(() => '');
    }
    if (inputTextAreaRef && inputTextAreaRef.current)
      inputTextAreaRef.current.focus();
  }

  const raiseHand = () => {
    let handRaised = (_currentUser.handUp === true);
    meetingClient?.sendHandRaised(!handRaised);
  }

  const requestToggleHeart = () => {
    meetingClient?.toggleHeartAnimation(isHeartAnimating);
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChat();
    }
  }

  const raiseHandButton = () => {
    if ((_currentUser.type === UserType.AUDIENCE || _currentUser.type === UserType.BROADCASTER) || !hasPermission(_currentUser, UserPermission.canRaiseHand)) {
      return null
    }
    return <IconButton
      aria-label="Raise Hand"
      icon={<IoMdHand size="1.8em" />}
      color={_currentUser?.handUp ? '#FFD700' : 'gray'}
      minW="1.85rem"
      _hover={{ color: "black" }}
      _focus={{}}
      variant="unstyled"
      pt="0.7rem"
      onClick={() => raiseHand()}
    />
  }

  return (
    <HStack spacing={1}>
      {raiseHandButton()}
      <InputGroup size="md">
        <Textarea
          className="chatTextArea"
          ref={inputTextAreaRef}
          placeholder="Type text here..."
          borderRadius="0"
          size="sm"
          minH="54px"
          mr="3rem"
          mt="1rem"
          resize="none"
          lineHeight="35px"
          value={text}
          _focus={{}}
          onChange={(event) => setText(event.target.value)}
          onKeyPress={event => handleKeyPress(event)}
        />
        <InputRightElement width="3rem" minH="54px" bg="gray.100" my="1rem">
          <IconButton
            colorScheme="blue"
            aria-label="Search database"
            icon={<BiSend color="gray" size="1.3em" />}
            variant="ghost"
            size="lg"
            rounded="unset"
            minH="54px"
            _focus={{}}
            borderWidth="1px"
            borderLeftWidth="0px"
            onClick={() => handleChat()}
          />
        </InputRightElement>
      </InputGroup>
      <IconButton
        aria-label="Send Hearts"
        icon={<FaHeart size="1.8em" />}
        color="gray"
        minW="1.85rem"
        _hover={{ color: "black" }}
        _focus={{}}
        
        variant="unstyled"
        pt="0.7rem"
        onClick={requestToggleHeart}
      />
    </HStack>
  );
};