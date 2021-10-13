// @flow 
import * as React from 'react';
import { ChatBubble } from './_chatBubble';
import { useRecoilValue } from 'recoil';
import { chatIdsSelector } from '../../../recoil/atoms/chats';

interface ChatListProps {
  screenRef: React.RefObject<HTMLDivElement>
}

export const ChatList = ({ screenRef }: ChatListProps) => {

  React.useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef?.current?.scrollHeight || 0;
    }
    //screenRef.current.scrollIntoView({behavior: 'smooth'});
  });

  const allChatIds = useRecoilValue(chatIdsSelector) as string[];
  
  return (
    <>
      {allChatIds.map((id: string) => <ChatBubble chatId={id} key={id} />)}
    </>
  );
};