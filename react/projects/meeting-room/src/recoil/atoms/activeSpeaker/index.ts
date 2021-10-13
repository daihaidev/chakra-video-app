import { atom, DefaultValue, selector } from "recoil";
import { ActiveSpeaker } from './types'

export const defaultActiveSpeaker = {
  uid: ''
}

const activeSpeakerAtom = atom<ActiveSpeaker>({
  key: "activeSpeakerAtom",
  default: defaultActiveSpeaker
});

export const activeSpeakerSelector = selector({
  key: "activeSpeakerSelector",
  get: ({ get }) => {
    return get(activeSpeakerAtom);
  },
  set: ({ set }, activeSpeaker: ActiveSpeaker | DefaultValue) => {
    set(activeSpeakerAtom, activeSpeaker);
  }
});