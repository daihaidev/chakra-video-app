import {
  atom,
  atomFamily,
  selector,
  selectorFamily
} from "recoil";

import { BannerIdsSetterAction, BannerModel } from './types';

const bannersAtom = atomFamily({
  key: "bannersAtom",
  default: null
});

const bannerIdsAtom = atom<string[]>({
  key: "bannerIdsAtom",
  default: []
});

// abstraction
export const bannersSelector = selectorFamily<Partial<BannerModel>, string>({
  key: "bannersSelector",
  get: (id) => ({ get }) => {
    return get(bannersAtom(id));
  },
  set: (id) => ({ set }, attributes) => {
    set(bannersAtom(id), banner => ({ ...banner, ...attributes }));
  }
});

export const bannerIdsSelector = selector({
  key: "bannerIdsSelector",
  get: ({ get }) => {
    return get(bannerIdsAtom);
  },
  set: ({ set, reset, get }, action) => {
    const { id, name, banners, attributes } = action as BannerIdsSetterAction;
    if (name === 'ADD') {
      let bannerArr = banners;
      for (let banner of bannerArr) {
        set(bannersAtom(banner.id), banner);
      }
      const newBannerIds = bannerArr.map(banner => banner.id);
      set(bannerIdsAtom, bannerIds => ([...bannerIds, ...newBannerIds]));
    }

    if (name === 'UPDATE') {
      set(bannersAtom(id), banner => ({ ...banner, ...attributes }));
    }

    if (name === 'REMOVE') {
      let bannerArr = banners;
      for (let banner of bannerArr) {
        reset(bannersAtom(banner.id));
        set(bannerIdsAtom, prev => prev.filter(bid => bid !== banner.id));
      }
    }
    if (name === 'RESET') {
      let bannerArr = get(bannerIdsAtom);
      for (let banner of bannerArr) {
        reset(bannersAtom(banner));
      }
      set(bannerIdsAtom, []);
    }
  }
});


//This is Banner Objects List used in the Banners Tab in services panel
export const bannerListSelector = selector({
  key: "bannerListSelector",
  get: ({ get }) => {
    const bannerIdsList = get(bannerIdsAtom);
    return bannerIdsList.map(bid => get(bannersAtom(bid)));
  }
});

export const dummyBanners = [
  { id: '1', message: 'Banner - 1 - Greeting Message', published: false },
  { id: '2', message: 'Banner - 2 - Greeting Message', published: false },
  { id: '3', message: 'Banner - 3 - Greeting Message', published: false },
  { id: '4', message: 'Banner - 4 - Greeting Message', published: false },
  { id: '5', message: 'Banner - 5 - Greeting Message', published: false },
  { id: '6', message: 'Banner - 6 - Greeting Message', published: false },
  { id: '7', message: 'Banner - 7 - Greeting Message', published: false },
  { id: '8', message: 'Banner - 8 - Greeting Message', published: false },
  { id: '9', message: 'Banner - 9 - Greeting Message', published: false },
  { id: '10', message: 'Banner - 10 - Greeting Message', published: false }
];


