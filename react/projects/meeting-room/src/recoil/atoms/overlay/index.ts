import { atom, selector } from "recoil";

import { OverlayModel } from './types';

const overlayAtom = atom({
  key: "overlayAtom",
  default: null
});

export const overlaySelector = selector<OverlayModel | null>({
  key: "overlaySelector",
  get: ({ get }) => {
    return get(overlayAtom);
  },
  set: ({ set }, overlay) => {
    set(overlayAtom, overlay);
  }
});