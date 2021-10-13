import { atom, selector } from "recoil";
import { BadgeModel } from "../badges/types";

const popupAtom = atom({
  key: "popupAtom",
  default: null
});

export const popupSelector = selector<Partial<BadgeModel>>({
  key: "popupSelector",
  get: ({ get }) => {
    return get(popupAtom);
  },
  set: ({ set }, popup) => {
    set(popupAtom, popup);
  }
});