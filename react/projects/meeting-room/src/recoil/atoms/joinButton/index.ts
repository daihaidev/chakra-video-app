import { atom, DefaultValue, selector } from "recoil";

const joinButtonLoadingAtom = atom({
  key: "joinButtonLoadingAtom",
  default: false
});

export const joinButtonLoadingSelector = selector({
  key: "joinButtonLoadingSelector",
  get: ({ get }) => {
    return get(joinButtonLoadingAtom);
  },
  set: ({ set }, isLoading: boolean | DefaultValue) => {
    set(joinButtonLoadingAtom, isLoading);
  }
});