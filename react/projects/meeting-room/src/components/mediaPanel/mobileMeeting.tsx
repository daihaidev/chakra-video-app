import { Box, BoxProps, IconButton, SimpleGrid, Image, Button } from "@chakra-ui/react"
import { useAnimation } from "framer-motion"
import React, { useEffect, useState } from "react"
import { withOrientationChange } from "react-device-detect"
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs"
import { useRecoilState, useRecoilValue } from "recoil"
import useWindowSize from "../../hooks/useWindowSize"
import MobileChat from "./mobile/mobileChat"
import { StyledResizableBox } from "../common/resizableBox"
import { MotionBox } from "./motionBox"
import BannerOverlay from '../servicesPanel/banners/_bannerOverlay';
import { overlaySelector } from "../../recoil/atoms/overlay"
import MediaPlayer from "./_mediaPlayer"
import { screenShareUserSelector } from "../../recoil/atoms/screenShareUser"
import { activeSpeakerSelector } from "../../recoil/atoms/activeSpeaker"
import { roomSelector } from "../../recoil/atoms/room"
import Logo from '../../assets/images/logo.png';
import layoutStates from "../../recoil/atoms/layout"
import BadgeOverlay from "../servicesPanel/badges/_badgeOverlay"
import ChatOverlay from "../servicesPanel/chat/_chatOverlay"
import MobilePrevSpeakerStreams from "./mobile/mobileSpeakerStreams"

interface PlayerProps extends BoxProps { }

const MobileMeeting = ({ ...props }: PlayerProps) => {
  const axis = 'y';
  const animationVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const screenSize = useWindowSize();
  const isLandscape = screenSize.width > screenSize.height;
  const toggleControls = useAnimation();

  const overlay = useRecoilValue(overlaySelector);
  const shareScreenUser = useRecoilValue(screenShareUserSelector);
  const activeSpeaker = useRecoilValue(activeSpeakerSelector);
  const room = useRecoilValue(roomSelector);
  const [fullScreen, setFullScreen] = useRecoilState(layoutStates.fullScreen);
  const [videoSize, setVideoSize] = useState({ width: null, height: null });
  const [chatSize, setChatSize] = useState({ width: null, height: null });
  const [videoConstraints, setVideoConstraints] = useState(
    Object.values(screenSize)
  );

  const _styling = {
    backgroundColor: 'black',
    width: (fullScreen) ? '100vw' : videoSize.width + 'px',
    height: (fullScreen) ? '100vh' : videoSize.height + 'px',
    ObjectFit: 'cover',
    maxWidth: (fullScreen) ? '100vw' : '1000px',
    marginBottom: '5px'
  };

  const videoSizeDefault = {
    width:
      screenSize.width,
    height: screenSize.height * 0.5
  };

  const chatSizeDefault = {
    width: screenSize.width,
    height: screenSize.height * 0.5
  };

  const resizeVideo = (handle: string) => (
    <Box
      width={videoSize.width || 'auto'}
      height={fullScreen ? '100vh' : videoSize.height || 'auto'}
      position="relative"
      display="inline-block"
      id="video-wrapper"
    >
      <MediaPlayer
        uid={(shareScreenUser && shareScreenUser.uid) ? shareScreenUser.uid : activeSpeaker?.uid}
        styling={_styling}
        showLeave={true}
      />
    </Box>
  );

  const onResizeVideo = (event, { element, size, handle }) => {
    setVideoSize({ width: size.width, height: size.height })
    setChatSize({
      width: screenSize.width,
      height: screenSize.height - videoSize.height
    })
  };

  const videoResizeHandles = !fullScreen ? ['s'] : ['e'];
  const chatResizeHandles = !fullScreen ? ['n'] : ['w'];

  useEffect(() => {
    setVideoConstraints(Object.values(screenSize))
    setVideoSize(videoSizeDefault)
    setChatSize(chatSizeDefault)
  }, [screenSize, fullScreen]);

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen)
  };

  const renderOverlay = () => {
    if (overlay === null) return null;
    const { type } = overlay;
    switch (type) {
      case 'banner':
        return <BannerOverlay {...overlay} />;
      case 'chat':
        return <ChatOverlay {...overlay} />;
      case 'badge':
        return <BadgeOverlay {...overlay} />;
    }
  };

  return (
    <Box>
      {(screenSize.width || videoSize.height || chatSize.width) && (
        <Box
          {...props}
          flexDirection={!isLandscape ? 'column' : 'row'}
          d="flex"
          w="100vw"
          h="100vh"
          overflow="hidden"
        >
          <StyledResizableBox
            overflow="hidden"
            axis={axis}
            onResize={!fullScreen && onResizeVideo}
            width={screenSize.width}
            height={videoSize.height}
            minConstraints={[388, 250]}
            maxConstraints={videoConstraints}
            handle={!fullScreen && resizeVideo}
            handleSize={[screenSize.width, screenSize.height]}
            resizeHandles={videoResizeHandles}
            preventDefaultTouchmoveEvent={true}
            cursor={'ns-resize'}
            draggableOpts={{
              allowAnyClick: true,
              enableUserSelectHack: true
            }}
            onClick={event => event.preventDefault()}
          >
            {fullScreen && (
              <>
                <Box
                  width={videoSize.width || 'auto'}
                  height={fullScreen ? '100vh' : videoSize.height || 'auto'}
                  position="relative"
                  display="inline-block"
                  id="video-wrapper"
                >
                  <MediaPlayer
                    uid={(shareScreenUser && shareScreenUser.uid) ? shareScreenUser.uid : activeSpeaker?.uid}
                    styling={_styling}
                    showLeave={true}
                  />
                </Box>
              </>
            )}

          </StyledResizableBox>
          <Box
            position="fixed"
            width={videoSize.width}
            zIndex="tooltip"
            pl="2"
            pt="2"
            top="0"
          >
            <Image
              boxSize="40px"
              src={room?.branding?.roomHeaderIcon ? room.branding.roomHeaderIcon : Logo}
              alt="MO Logo"
            />
          </Box>
          <Box
            position="fixed"
            width={videoSize.width}
            zIndex="tooltip"
            pr="2"
            pt="1"
            top="0"
          >
            <MotionBox
              animate={toggleControls}
              initial="visible"
              variants={animationVariants}
              onMouseOver={() => toggleControls.start('visible')}
              d="flex"
              justifyContent="flex-end"
            >
              <IconButton
                aria-label={fullScreen ? 'Minimise' : 'Full screen'}
                variant="ghost"
                icon={fullScreen ? <BsFullscreenExit /> : <BsFullscreen />}
                fontSize="xl"
                color="white"
                onClick={toggleFullScreen}
                _hover={{ bg: 'transparent' }}
              />
            </MotionBox>
          </Box>
          <Box
            position="absolute"
            width={videoSize.width}
            top={`${(fullScreen ? screenSize.height - 180 : videoSize.height - 120)
              }px`}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              w="100%"
              position="absolute"
              top={0}
              px="6"
            >
              {renderOverlay()}
            </SimpleGrid>
          </Box>

          {!fullScreen && (
            <StyledResizableBox
              width={chatSize.width}
              height={chatSize.height}
              handleSize={[screenSize.width, screenSize.height]}
              resizeHandles={chatResizeHandles}
              axis={axis}
              mb="0"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Box position="absolute" bottom="60px" px={1} width="100%">
                <MobilePrevSpeakerStreams />
              </Box>
              <MobileChat {...chatSize} />
            </StyledResizableBox>
          )}
        </Box>
      )}
    </Box>
  )
}

export default withOrientationChange(MobileMeeting)
