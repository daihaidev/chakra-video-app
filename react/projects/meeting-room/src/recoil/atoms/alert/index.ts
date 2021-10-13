import { atom, selector } from "recoil";

const alertAtom = atom({
  key: "moAlertAtom",
  default: false
});

export const alertSelector = selector<boolean>({
  key: "moAlertSelector",
  get: ({ get }) => {
    return get(alertAtom);
  },
  set: ({ set }, isLoading) => {
    set(alertAtom, isLoading);
  }
});