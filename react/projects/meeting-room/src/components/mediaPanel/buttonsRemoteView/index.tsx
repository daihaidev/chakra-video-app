import * as React from 'react';
import { Stack, Center } from "@chakra-ui/react";
import { SpotlightButton } from './_spotlightButton';
import { InterviewPortraitButton } from './_interviewPortraitButton';
import { InterviewLandscapeButton } from './_interviewLandscapeButton';
import { SplitScreenWithFocusBtn } from './_splitScreenWithFocusBtn';
import { ScreenshareWithSingleHost } from './_screenshareWithSingleHost';
import { ScreenshareWithHostsBtn } from './_screenshareWithHostsBtn';
import { ScreenshareBtn } from './_screenshareBtn';
import { currentUserIdAtom, usersSelector } from "../../../recoil/atoms/users";
import { useRecoilValue } from 'recoil';

export const ButtonsRemoteView = () => {
  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));
  const UserType = window.MeetOnline.UserType;

  if (_currentUser.type === UserType.MODERATOR || _currentUser.type === UserType.AUDIENCE || _currentUser.type === UserType.BROADCASTER) {
    // For now Remote View buttons are Hidden for all types of Users.
    return null;
  }

  return (
    <Center zIndex="10000">
      <Stack direction="row" spacing={2} pt="1">
        <SpotlightButton />
        <InterviewPortraitButton />
        <InterviewLandscapeButton />
        <SplitScreenWithFocusBtn />
        <ScreenshareWithSingleHost />
        <ScreenshareWithHostsBtn />
        <ScreenshareBtn />
      </Stack>
    </Center>

  );
};
export default ButtonsRemoteView;