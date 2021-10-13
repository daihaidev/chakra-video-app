import * as React from 'react';
import { ButtonGroup, Center } from "@chakra-ui/react";
import { SDKContext } from '../../../context/SDKContext';
import { FaMicrophoneSlash, FaMicrophone, FaVideoSlash, FaVideo, FaCog, FaDesktop, FaThLarge, FaUserPlus, FaWindowClose } from "react-icons/fa";
import { viewSelector } from "../../../recoil/atoms/view";
import { Views } from '../../../constants';
import { currentUserIdAtom, usersSelector } from "../../../recoil/atoms/users";
import { screenShareUserSelector } from "../../../recoil/atoms/screenShareUser";
import { alertSelector } from "../../../recoil/atoms/alert";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import LocalButton from './_localButton';
import { Alert } from '../../common/alert';

const UserType = window.MeetOnline.UserType
const UserPermission = window.MeetOnline.UserPermission;

export const ButtonsLocalView = () => {
  const setIsOpen = useSetRecoilState(alertSelector);

  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));
  const { type, micEnabled, camEnabled, screenShareEnabled, permissions } = _currentUser;

  const screenShareUser = useRecoilValue(screenShareUserSelector);
  //let screenShareUserId = screenShareUser?.uid?.replace('ss', '')?.trim();
  //const screenShareUserObj = useRecoilValue(usersSelector(screenShareUserId));
  //let screenShareUserName = screenShareUserObj?.name;

  const meetingClient = React.useContext(SDKContext);
  const setView = useSetRecoilState(viewSelector);

  const toggleScreenShare = () => {
    if (screenShareUser && screenShareUser.uid && screenShareUser.uid !== 'ss' + _currentUserId) {
      setIsOpen(true);
    } else {
      meetingClient?.rtc?.requestScreenShare();
    }
  }
  const overwriteScreenShare = () => {
    setIsOpen(false);
    meetingClient?.rtc?.requestScreenShare();
  }
  const showByePage = () => {
    meetingClient?.disconnectGateway(0);
    setView(Views.BYE);
  }

  const isButtonHidden = (p: number) => {
    if (type === UserType.AUDIENCE || type === UserType.BROADCASTER) {
      return ((permissions & p) === 0); //TODO check why & before
    }
    return false;
  }

  return (
    <Center my="0.4rem" ml="3em">
      <ButtonGroup size="md" isAttached variant="outline" color="gray.500" zIndex="10000">
        <LocalButton
          id="1"
          names={["Unmute", "Mute"]}
          icons={[<FaMicrophoneSlash />, <FaMicrophone />]}
          enabled={micEnabled}
          setter={() => meetingClient?.toggleMic(micEnabled)}
          isHidden={isButtonHidden(UserPermission.canUseMic)}
        />

        <LocalButton
          id="2"
          names={["Start Cam", "Stop Cam"]}
          icons={[<FaVideoSlash />, <FaVideo />]}
          enabled={camEnabled}
          setter={() => meetingClient?.toggleCam(camEnabled)}
          isHidden={isButtonHidden(UserPermission.canUseCam)}
        />

        <LocalButton
          id="3"
          names={["Settings"]}
          icons={[<FaCog />]}
          isHidden={isButtonHidden(UserPermission.canSeeSettingButton)}
        />

        <LocalButton
          id="4"
          names={["Start Screen", "Stop Screen"]}
          icons={[<FaDesktop />, <FaDesktop />]}
          enabled={screenShareEnabled}
          setter={toggleScreenShare}
          isHidden={isButtonHidden(UserPermission.canUseScreenshare)}
        />

        <LocalButton
          id="5"
          names={["Change View"]}
          icons={[<FaThLarge />]}
          isHidden={true}
        />

        <LocalButton
          id="6"
          names={["Invite"]}
          icons={[<FaUserPlus />]}
          isHidden={true}
        />

        <LocalButton
          id="7"
          names={["Leave"]}
          icons={[<FaWindowClose />]}
          handler={showByePage}
        />
      </ButtonGroup>
      <Alert
        title="Screenshare in use"
        description="Someone else is currently sharing their screen. Would you like to share your screen instead?"
        cancelButtonName="Cancel"
        actionButtonName="Share"
        actionFunction={overwriteScreenShare}
      />
    </Center>
  );
};
export default ButtonsLocalView;