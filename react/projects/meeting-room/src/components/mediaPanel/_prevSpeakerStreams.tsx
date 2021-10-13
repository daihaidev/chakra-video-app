import * as React from 'react';
import { Center } from "@chakra-ui/react";
import { userIdsSelector, currentUserIdAtom, usersSelector } from '../../recoil/atoms/users';
import { activeSpeakerSelector } from '../../recoil/atoms/activeSpeaker';
import { screenShareUserSelector } from '../../recoil/atoms/screenShareUser';
import { overlaySelector } from '../../recoil/atoms/overlay';
import { useRecoilValue } from 'recoil';
import MediaPlayer from './_mediaPlayer';

const _styling = {
  width: 'calc((107px) * 16/9)',
  height: "107px",
  ObjectFit: 'cover',
  borderRadius: "0.375rem",
  backgroundColor: 'black',
  marginRight: "0.3rem"
}
export const PrevSpeakerStreams = () => {

  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));

  const allUserIds = useRecoilValue(userIdsSelector);
  const activeSpeaker = useRecoilValue(activeSpeakerSelector);
  const screenShareUser = useRecoilValue(screenShareUserSelector);
  const _overlay_ = useRecoilValue(overlaySelector);
  let isOverlay = (_overlay_ !== null);

  let otherUserIds: string[] = [];
  if (screenShareUser && screenShareUser.uid) {
    otherUserIds = allUserIds;
  } else {
    otherUserIds = allUserIds.filter((uid) => uid !== activeSpeaker.uid);
  }

  if (_currentUser.type === 'AUDIENCE') return null;

  return (
    <Center spacing={8}
      id="remote-players"
      mt={isOverlay ? '22px' : '10px'}
      w="56vw"
      minW="738px"
      className="video-player"
    >
      {otherUserIds.map(uid =>
        <MediaPlayer key={`player-${uid}`} uid={uid} styling={_styling} prevSpeaker={true} />
      )}
    </Center>
  );
};
export default PrevSpeakerStreams;