import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily
} from "recoil";

import { UserIdsSetterAction, UserModel } from './types';

const usersAtom = atomFamily({
  key: "users",
  default: null
});

const userIdsAtom = atom<string[]>({
  key: "userIds",
  default: []
});

export const currentUserIdAtom = atom({
  key: "currentUserIdAtom",
  default: null
});

export const currentUserNameAtom = atom({
  key: "currentUserNameAtom",
  default: ""
});

export const usersSelector = selectorFamily<UserModel, string>({
  key: "users-access-by-id",
  get: (id) => ({ get }) => {
    return get(usersAtom(id));
  },
  set: (id) => ({ set }, attributes) => {
    return set(usersAtom(id), user => ({ ...user, ...attributes }));
  }
});

export const userIdsSelector = selector({
  key: "userIdsSelector",
  get: ({ get }) => {
    return get(userIdsAtom);
  },
  set: ({ set, reset, get }, action: any) => {
    if (action instanceof DefaultValue) {
      return false;
    }
    else {
      const { name, users, userId, attributes } = action as UserIdsSetterAction;
      if (name === 'ADD') {
        let userArr = users;
        for (let user of userArr) {
          set(usersAtom(user.id), user);
          if (user.sessionId) { //current user
            set(currentUserIdAtom, user.id)
          }
        }
        const newUserIds = userArr.map(user => user.id);
        set(userIdsAtom, userIds => ([...userIds, ...newUserIds]));
      }

      if (name === 'UPDATE') {
        set(usersAtom(userId), user => ({ ...user, ...attributes }));
      }

      if (name === 'REMOVE') {
        let userArr = users;
        for (let user of userArr) {
          reset(usersAtom(user.id));
          set(userIdsAtom, prev => prev.filter(uid => uid !== user.id));
        }
      }
      if (name === 'RESET') {
        let userArr = get(userIdsAtom);
        for (let user of userArr) {
          reset(usersAtom(user));
        }
        set(userIdsAtom, []);
      }
    }
  }
});


//This is User Object List used in the Participants List
export const userListSelector = selector({
  key: "userListSelector",
  get: ({ get }) => {
    const userIdsList = get(userIdsAtom);
    return userIdsList.map(uid => get(usersAtom(uid)));
  }
});


