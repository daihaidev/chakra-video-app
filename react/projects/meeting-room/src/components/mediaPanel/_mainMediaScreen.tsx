import * as React from 'react';
import MediaPlayer from './_mediaPlayer';
import { activeSpeakerSelector } from '../../recoil/atoms/activeSpeaker';
import { screenShareUserSelector } from '../../recoil/atoms/screenShareUser';
import { useRecoilValue } from 'recoil';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Link } from "@chakra-ui/react";
import { FaExpand } from "react-icons/fa";
import { BiExitFullscreen } from "react-icons/bi";

// MainMediaScreen = [local user,  active speaker, screen share user]
export const MainMediaScreen = () => {

  const activeSpeaker = useRecoilValue(activeSpeakerSelector);
  console.log("MainMediaScreen # activeSpeaker - ", activeSpeaker);

  const shareScreenUser = useRecoilValue(screenShareUserSelector);
  console.log("MainMediaScreen # shareScreenUser - ", shareScreenUser);

  const fsHandle = useFullScreenHandle();

  console.log("fsHandle ----> ", fsHandle);

  const _styling = {
    backgroundColor: 'black',
    width: (fsHandle && fsHandle?.active) ? '100vw' : 'calc(16 * 56vh / 9)',
    height: (fsHandle && fsHandle?.active) ? '100vh' : '56vh',
    ObjectFit: 'cover',
    borderRadius: "0.375rem",
    maxWidth: (fsHandle && fsHandle?.active) ? '100vw' : '1000px',
    marginBottom: '5px'
  }

  return (
    <FullScreen handle={fsHandle}>
      <MediaPlayer
        uid={(shareScreenUser && shareScreenUser.uid) ? shareScreenUser.uid : activeSpeaker?.uid}
        styling={_styling}
      />
      <Link
        onClick={(fsHandle && fsHandle?.active) ? fsHandle.exit : fsHandle.enter}
        color="#fff"
        pos="absolute"
        zIndex="1000"
        mt={(fsHandle && fsHandle?.active) ? '-35px' : '-30px'}
        ml={(fsHandle && fsHandle?.active) ? '98vw' : '95.6vh'}
      >
        {(fsHandle && fsHandle?.active) ? <BiExitFullscreen size="1.6em" /> : <FaExpand size="1.3em" />}
      </Link>
    </FullScreen>
  );
};
export default MainMediaScreen;