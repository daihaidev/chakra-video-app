import { atom, selector } from "recoil";

import { RoomIdsSetterAction, Room } from './types'

export const defaultRoom = {
  name: '',
  roomHash: '',
  roomSessionId: '',
  branding: {
  }
}

const roomAtom = atom({
  key: "room",
  default: null
});

export const roomSelector = selector<Room | null>({
  key: "roomSelector",
  get: ({ get }) => {
    return get(roomAtom);
  },
  set: ({ set }, action) => {
    const { name, attributes } = action as RoomIdsSetterAction;
    if (name === 'RESET') {
      set(roomAtom, defaultRoom);
    }
    else {
      set(roomAtom, roomObj => ({ ...roomObj, ...attributes }));
    }
  }
});