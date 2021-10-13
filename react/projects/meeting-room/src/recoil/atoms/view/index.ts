import { atom, DefaultValue, selector } from "recoil";
import { Views } from '../../../constants';

const viewAtom = atom({
  key: "view",
  default: Views.LOADING
});

export const viewSelector = selector({
  key: "viewSelector",
  get: ({ get }) => {
    return get(viewAtom);
  },
  set: ({ set }, newView: string | DefaultValue) => {
    set(viewAtom, newView);
  }
});