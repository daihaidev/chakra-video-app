import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { MediaPanel } from "../../mediaPanel";
import { ServicesPanel } from "../../servicesPanel";
import { useRecoilState, useRecoilValue } from "recoil";
import { roomSelector } from "../../../recoil/atoms/room";
import PopupWindow from '../../common/popupWindow';
import MobileMeeting from "../../mediaPanel/mobileMeeting"
import useWindowSize from "../../../hooks/useWindowSize";
import { isMobileDevice } from "../../../util/browser";
import layoutStates from "../../../recoil/atoms/layout";

export const MeetingRoom = () => {
  const screenSize = useWindowSize()
  const isMobile = isMobileDevice(screenSize)

  const room = useRecoilValue(roomSelector);
  const [_, setShowHeader] = useRecoilState(layoutStates.showHeader)

  React.useEffect(() => {
    setShowHeader(!isMobile)
  }, [isMobile])

  return (
    <Flex>
      {isMobile ? <MobileMeeting />
        : (
          <>
            <Box
              w="66.66vw"
              minW="768px"
              p="4"
              bgColor={room?.branding?.roomBackgroundColor ? room.branding.roomBackgroundColor : "gray.100"}
              bgImage={room?.branding?.roomBackgroundImage ? `url(${room.branding.roomBackgroundImage})` : "none"}
              bgSize="cover"
            >
              <MediaPanel />
            </Box>
            <Box w="33.33vw" p="0" bg="white">
              <ServicesPanel />
            </Box>
          </>
        )
      }
      <PopupWindow />
    </Flex>
  );
};
export default MeetingRoom;
