import * as React from 'react';
import { Box, Center, Flex, Spacer, Avatar, Text } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { chatsSelector, chatIdsSelector } from '../../../recoil/atoms/chats';
import { bannerIdsSelector } from '../../../recoil/atoms/banners';
import { badgeIdsSelector } from '../../../recoil/atoms/badges';
import { usersSelector, currentUserIdAtom } from '../../../recoil/atoms/users';
import * as Util from "../../../util";
import { roomSelector } from '../../../recoil/atoms/room';
import MouseHoverButtons from '../../common/mouseHoverButtons';
import { overlaySelector } from '../../../recoil/atoms/overlay';
import { SDKContext } from '../../../context/SDKContext';

const UserType = window.MeetOnline.UserType

interface ChatBubbleProps {
  chatId: string;
}

export const ChatBubble = ({ chatId }: ChatBubbleProps) => {
  const chatBubbleRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [chat, setChat] = useRecoilState(chatsSelector(chatId));
  const setChats = useSetRecoilState(chatIdsSelector);
  const setBanners = useSetRecoilState(bannerIdsSelector);
  const setBadges = useSetRecoilState(badgeIdsSelector);

  const { id, author, timestamp, message, published } = chat;

  const currentOverlay = useRecoilValue(overlaySelector);
  const room = useRecoilValue(roomSelector);

  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const { type } = useRecoilValue(usersSelector(_currentUserId));
  const isModerator = (type === UserType.MODERATOR);

  const meetingClient = React.useContext(SDKContext);

  const toggleChat = () => {
    if (published) {
      setChat({ published: false });
      meetingClient?.unPublishOverlay(currentOverlay?.id);
    }
    else {
      //Un-publish previous Banner if any
      if (currentOverlay) {
        if (currentOverlay.type === 'banner')
          setBanners({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'badge')
          setBadges({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'chat')
          setChats({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
      }
      //Publish new Chat Overlay
      setChat({ published: true });
      meetingClient?.publishOverlay({
        ...chat,
        type: 'chat',
        height: chatBubbleRef?.current?.offsetHeight,
        published: true
      });
    }
  }


  return (
    <Box
      bgColor={room?.branding?.commentBackgroundColor ? room.branding.commentBackgroundColor : 'white'}
      w="100%"
      key={`box-${id}`}
      mb="1rem"
      p="0.30rem"
      borderRadius="0.6rem"
      onMouseEnter={() => setHovered(isModerator)}
      onMouseLeave={() => setHovered(false)}
      _hover={isModerator ? { opacity: 1 } : { opacity: 1 }}
      ref={chatBubbleRef}
    >
      <Center pos="absolute" h={(chatBubbleRef?.current?.offsetHeight || 0) - 5} ml={(chatBubbleRef?.current?.offsetWidth || 0) / 2.2}>
        <MouseHoverButtons isPublished={published} isHovered={hovered} toggleOverlay={toggleChat} />
      </Center>
      <Flex textColor="gray" opacity={hovered ? 0.5 : 1}>
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
      <Box
        px="1.9rem"
        wordBreak="break-word"
        textColor={room?.branding?.commentTextColor ? room.branding.commentTextColor : 'inherit'}
        fontFamily={room?.branding?.commentFontFamily ? room.branding.commentFontFamily : 'inherit'}
      >
        <Text fontSize="sm" color={hovered ? 'gray.300' : 'inherit'}>{message}</Text>
      </Box>
    </Box>
  );
};