import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily
} from "recoil";

import { BadgeModel, BadgeIdsSetterAction } from './types';

const badgesAtom = atomFamily({
  key: "badgesAtom",
  default: null
});

const badgeIdsAtom = atom({
  key: "badgeIdsAtom",
  default: []
});

// abstraction
export const badgesSelector = selectorFamily<Partial<BadgeModel>, string>({
  key: "badgesSelector",
  get: (id) => ({ get }) => {
    return get(badgesAtom(id));
  },
  set: (id) => ({ set }, attributes: Partial<BadgeModel> | DefaultValue) => {
    return set(badgesAtom(id), badge => ({ ...badge, ...attributes }));
  }
});

export const badgeIdsSelector = selector({
  key: "badgeIdsSelector",
  get: ({ get }) => {
    return get(badgeIdsAtom);
  },
  set: ({ set, reset, get }, action) => {
    const { name, badges, id, attributes } = action as BadgeIdsSetterAction;
    if (name === 'ADD') {
      let badgeArr = badges;
      for (let badge of badgeArr) {
        set(badgesAtom(badge.id), badge);
      }
      const newBadgesIds = badgeArr.map(badge => badge.id);
      set(badgeIdsAtom, badgeIds => ([...badgeIds, ...newBadgesIds]));
    }

    if (name === 'UPDATE') {
      set(badgesAtom(id), badge => ({ ...badge, ...attributes }));
    }

    if (name === 'REMOVE') {
      let badgeArr = badges;
      for (let badge of badgeArr) {
        reset(badgesAtom(badge.id));
        set(badgeIdsAtom, prev => prev.filter(bid => bid !== badge.id));
      }
    }
    if (name === 'RESET') {
      let badgeArr: BadgeModel[] = get(badgeIdsAtom);
      for (let badge of badgeArr) {
        reset(badgesAtom(badge.id));
      }
      set(badgeIdsAtom, []);
    }
  }
});


//This is Badges Objects List used in the LiveSell Tab in services panel
export const badgeListSelector = selector({
  key: "badgeListSelector",
  get: ({ get }) => {
    const badgeIdsList = get(badgeIdsAtom);
    return badgeIdsList.map(bid => get(badgesAtom(bid)));
  }
});

export const dummyBadges = [
  {
    id: '100001',
    title: 'Walmart Icecream',
    description: 'Choclate flavour with ultra rich vitamin',
    currentPrice: '$99',
    oldPrice: '$210',
    email: 'helpdesk@walmart.com',
    image: 'https://meetonline.io/molb/public_html/images/badges/icecream.png',
    published: false
  },
  {
    id: '100002',
    title: 'Tesla Drone',
    description: 'Four dimensional control with supersonic speed',
    currentPrice: '$500',
    oldPrice: '$999',
    email: 'customercare@tesla.com',
    image: 'https://meetonline.io/molb/public_html/images/badges/drone.jpeg',
    published: false
  },
  {
    id: '100003',
    title: 'Alcohol Sanitizer',
    description: 'super safe with 70% alchohol',
    currentPrice: '$50',
    oldPrice: '$85',
    email: 'queries@santize.uk',
    image: 'https://meetonline.io/molb/public_html/images/badges/sanitizer.png',
    published: false
  },
  {
    id: '100004',
    title: 'Lagavulin scotch',
    description: 'Ultra rich flavour on low cost',
    currentPrice: '$199',
    oldPrice: '$410',
    email: 'help@lagavulin.com',
    image: 'https://meetonline.io/molb/public_html/images/badges/scotch.jpeg',
    published: false
  },
  {
    id: '100005',
    title: 'Digit Magzine',
    description: 'Curious about quantum computing?',
    currentPrice: '$70',
    oldPrice: '$150',
    email: 'helpdesk@digit.uk',
    image: 'https://meetonline.io/molb/public_html/images/badges/magzine.png',
    published: false
  },
  {
    id: '100006',
    title: 'Apple iOS 21',
    description: 'Super Ultra rich UI for gamma generation',
    currentPrice: '$999',
    oldPrice: '$1350',
    email: 'customer-care@apple.io',
    image: 'https://meetonline.io/molb/public_html/images/badges/iphone.png',
    published: false
  },

];


