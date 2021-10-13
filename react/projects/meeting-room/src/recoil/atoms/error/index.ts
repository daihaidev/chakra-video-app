import { atom, selector } from "recoil";

import { ErrorEntity } from './types';

const errorAtom = atom({
  key: "errorAtom",
  default: {}
});

export const errorSelector = selector<ErrorEntity>({
  key: "errorSelector",
  get: ({ get }) => {
    return get(errorAtom);
  },
  set: ({ set }, error) => {
    set(errorAtom, error);
  }
});