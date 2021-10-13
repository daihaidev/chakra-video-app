import { atom, selector } from "recoil";

const heartAnimationAtom = atom({
  key: "heartAnimationAtom",
  default: false
});

export const heartAnimationSelector = selector<boolean>({
  key: "heartAnimationSelector",
  get: ({ get }) => {
    return get(heartAnimationAtom);
  },
  set: ({ set }, heartAnimating) => {
    set(heartAnimationAtom, heartAnimating);
  }
});