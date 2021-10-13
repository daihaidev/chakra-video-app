import React, { useRef, useEffect } from "react";
import { Box, Avatar, Center, Button } from "@chakra-ui/react";
import { SDKContext } from '../../context/SDKContext';
import { currentUserIdAtom, usersSelector } from '../../recoil/atoms/users';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import layoutStates from "../../recoil/atoms/layout";
import MobileChatStream from "./mobile/mobileChatStream";
import useWindowSize from "../../hooks/useWindowSize";
import { isMobileDevice } from "../../util/browser";
import { bannerIdsSelector } from "../../recoil/atoms/banners";
import VideoControls from "./motionBox";
import { useAnimation } from "framer-motion";
import chroma from "chroma-js";
import SendMessage from "./mobile/mobileSendMessage";
import { hasPermission } from "../../util";
import { viewSelector } from "../../recoil/atoms/view";
import { Views } from "../../constants";
import useLeaveOverlay from "../../hooks/useLeaveOverlay"
import LocalButton from "./buttonsLocalView/_localButton";
import { FaWindowClose } from "react-icons/fa";
import { overlaySelector } from "../../recoil/atoms/overlay";

interface MediaPlayerProps {
  uid: string;
  prevSpeaker?: boolean;
  styling?: React.CSSProperties;
  showLeave?: boolean
}

const touchduration = 100;

const UserPermission = window.MeetOnline.UserPermission;

const MediaPlayer = ({ uid, styling, prevSpeaker, showLeave = false }: MediaPlayerProps) => {

  const screenSize = useWindowSize()
  const isMobile = isMobileDevice(screenSize)

  const { showLeaveOverlay, setShowLeaveOverlay } = useLeaveOverlay(showLeave, false)
  const [showDragOverlay, setShowDragOverlay] = React.useState(true && showLeave)

  React.useEffect(() => {
    setTimeout(() => {
      setShowDragOverlay(false)
    }, 5000)
  }, [])

  const [timeStamp, setTimeStamp] = React.useState({
    start: 0,
    end: 0
  })

  const currentUserId = useRecoilValue(currentUserIdAtom);
  const currentUser = useRecoilValue(usersSelector(currentUserId));
  const meetingClient = React.useContext(SDKContext);
  const overlay = useRecoilValue(overlaySelector);
  const userObj = useRecoilValue(usersSelector(uid?.replace('ss', '')));
  const { mediaConnected, screenShareEnabled } = userObj;
  const [fullScreen] = useRecoilState(layoutStates.fullScreen)
  const setView = useSetRecoilState(viewSelector);

  const chatEnabled = hasPermission(currentUser, UserPermission.canUseChat)

  let audioTrack: any;
  let videoTrack: any;

  if (mediaConnected === true) {
    let mediaTracks = meetingClient?.getMediaTracks(uid);
    audioTrack = mediaTracks?.audioTrack;
    videoTrack = mediaTracks?.videoTrack;
  }
  if (screenShareEnabled === true) {
    let mediaTracks = meetingClient?.getMediaTracks(uid);
    videoTrack = mediaTracks?.videoTrack;
  }
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    videoTrack?.play(container.current);
    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack, mediaConnected]);

  useEffect(() => {
    audioTrack?.play();
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack, mediaConnected]);

  const toggleControls = useAnimation()
  const bgControls = chroma("#040517").alpha(0.25).hex()

  const handleLeave = () => {
    meetingClient?.disconnectGateway(0);
    setView(Views.BYE);
  }

  const handleTouchStart = (e) => {
    setTimeStamp({ ...timeStamp, start: e.timeStamp })
  }

  const handleTouchEnd = React.useCallback((e) => {
    if (e.timeStamp - timeStamp.start < 100) {
      setShowLeaveOverlay(!showLeaveOverlay)
    }
    setTimeStamp({ start: 0, end: 0 })
  }, [showLeaveOverlay, timeStamp])

  return (
    <Center id="video">
      <Avatar
        name={userObj.name}
        size={prevSpeaker ? 'sm' : 'lg'}
        src={userObj.photo1}
        pos="absolute"
        zIndex={userObj.camEnabled ? 0 : 1801}
      />
      {fullScreen && isMobile && (
        <Box
          maxH={{ base: '56vh', sm: '90vh' }}
          minH={{ base: '26vh', sm: '40vh' }}
          position="absolute"
          bottom={overlay ? '190px' : '16'}
          w="full"
          px="4"
          overflowY="scroll"
          d="flex"
          flexDirection="column-reverse"
          justifyContent="flex-start"
        >
          <Box h="auto" zIndex="docked">
            <MobileChatStream length={3} />
          </Box>
        </Box>
      )}
      {fullScreen && (
        <VideoControls
          animate={toggleControls}
          initial="visible"
          bg={fullScreen ? bgControls : 'transparent'}
          rounded="md"
          d="flex"
          alignItems="center"
          onMouseOver={() => toggleControls.start('visible')}
          position="absolute"
          bottom={0}
        >
          <Box w="full" position="fixed" bottom="0" left="0" zIndex="tooltip">
            <SendMessage isFullScreen={fullScreen} />
          </Box>
        </VideoControls>
      )}
      {showLeaveOverlay && (
        <Box
          style={{ ...styling, background: 'rgba(255,255,255,0.5)' }}
          zIndex={1801}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <LocalButton
            id="1"
            names={["Leave"]}
            icons={[<FaWindowClose />]}
            handler={handleLeave}
          />
        </Box>
      )
      }
      {
        showDragOverlay && !fullScreen && (
          <Box position="absolute" bottom={10} zIndex={1} background="rgba(85, 85, 85, 0.6)" rounded={"lg"} padding="3" minW="200" textAlign="center" color="#fff">Drag to resize</Box>
        )
      }
      <Box id={`player-${uid}`} ref={container} className="video-player" style={styling} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
    </Center >
  );
}

export default MediaPlayer;