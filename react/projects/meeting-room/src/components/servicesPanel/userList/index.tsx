import * as React from 'react';
import { List, Accordion } from "@chakra-ui/react";
import { User } from './_user';
import { UserModeratorView } from './_user_modview';
import { userListSelector, currentUserIdAtom, usersSelector } from '../../../recoil/atoms/users';
import { userSorter } from '../../../util';
import { useRecoilValue } from 'recoil';

const UserType = window.MeetOnline.UserType;

//TODO: Replace this type with user recoil type
interface UserObject {
  id: string;
}

interface UserListProps {
  display?: string;
}

export const UserList = (props: UserListProps) => {
  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));

  const userList = useRecoilValue(userListSelector);
  const sortedList = [...userList].sort(userSorter);

  if (_currentUser.type === UserType.MODERATOR) {
    return (
      <Accordion spacing={0.5} allowMultiple>
        {(sortedList as UserObject[]).map((userObj, arrIndex, sortedList) => (<UserModeratorView userId={userObj.id} key={userObj.id} isLast={arrIndex === sortedList.length - 1} />))}
      </Accordion>
    );
  }

  return (
    <List spacing={0.5}>
      {(sortedList as UserObject[]).map(userObj => (<User userId={userObj.id} key={userObj.id} />))};
    </List>
  );
};

