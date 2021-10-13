import { atom, selector } from "recoil";

import { ScreenShareuserEntity } from './types';

const screenShareUserAtom = atom({
  key: "screenShareUserAtom",
  default: null
});

export const screenShareUserSelector = selector<ScreenShareuserEntity>({
  key: "screenShareUserSelector",
  get: ({ get }) => {
    return get(screenShareUserAtom);
  },
  set: ({ set }, ssUser) => {
    set(screenShareUserAtom, ssUser);
  }
});