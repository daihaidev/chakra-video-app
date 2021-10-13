import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily
} from "recoil";

import { ChatIdsSetterAction, ChatModel } from './types';

const chatsAtom = atomFamily({
  key: "chats",
  default: null
});

const chatIdsAtom = atom<string[]>({
  key: "chatIds",
  default: []
});

// abstraction
export const chatsSelector = selectorFamily<Partial<ChatModel>, string>({
  key: "chats-access-by-id",
  get: (id) => ({ get }) => {
    return get(chatsAtom(id));
  },
  set: (id) => ({ set }, attributes: Partial<ChatModel> | DefaultValue) => {
    return set(chatsAtom(id), chat => ({ ...chat, ...attributes }));
  }
});

export const chatIdsSelector = selector({
  key: "chatIdsSelector",
  get: ({ get }) => {
    return get(chatIdsAtom);
  },
  set: ({ set, reset, get }, action) => {
    const { name, id, chats, attributes } = action as ChatIdsSetterAction;
    if (name === 'ADD') {
      let chatArr = chats;
      for (let chat of chatArr) {
        set(chatsAtom(chat.id), chat);
      }
      const newChatIds = chatArr.map(chat => chat.id);
      set(chatIdsAtom, chatIds => ([...chatIds, ...newChatIds]));
    }

    if (name === 'UPDATE') {
      set(chatsAtom(id), chat => ({ ...chat, ...attributes }));
    }

    if (name === 'REMOVE') {
      let chatArr = chats;
      for (let chat of chatArr) {
        reset(chatsAtom(chat.id));
        set(chatIdsAtom, prev => prev.filter(cid => cid !== chat.id));
      }
    }
    if (name === 'RESET') {
      let chatArr = get(chatIdsAtom);
      for (let chat of chatArr) {
        reset(chatsAtom(chat));
      }
      reset(chatIdsAtom);
    }
  }
});

