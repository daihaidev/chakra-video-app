import * as React from 'react';
import { ChatScreen } from './_chatScreen';
import { ChatInput } from './_chatInput';

interface ChatProps {
  display?: string;
}

export const Chat = (props: ChatProps) => {
  return (
    <>
      <ChatScreen />
      <ChatInput />
    </>
  );
};