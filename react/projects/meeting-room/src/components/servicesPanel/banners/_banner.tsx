import * as React from 'react';
import { ListItem, Text, Center } from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { bannersSelector, bannerIdsSelector } from '../../../recoil/atoms/banners';
import { badgeIdsSelector } from '../../../recoil/atoms/badges';
import { chatIdsSelector } from '../../../recoil/atoms/chats';
import { overlaySelector } from '../../../recoil/atoms/overlay';
import MouseHoverButtons from '../../common/mouseHoverButtons';
import { SDKContext } from '../../../context/SDKContext';

interface BannerProps {
  bannerId: string;
}

const Banner = ({ bannerId }: BannerProps) => {
  const bannerRef = React.useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [banner, setBanner] = useRecoilState(bannersSelector(bannerId));
  const setBanners = useSetRecoilState(bannerIdsSelector);
  const setBadges = useSetRecoilState(badgeIdsSelector);
  const setChats = useSetRecoilState(chatIdsSelector);
  const { id, message, published } = banner;

  const currentOverlay = useRecoilValue(overlaySelector);
  const meetingClient = React.useContext(SDKContext);

  const toggleBanner = () => {
    if (published) {
      setBanner({ published: false });
      meetingClient?.unPublishOverlay(currentOverlay?.id);
    }
    else {
      //Un-publish previous Banner if any
      if (currentOverlay) {
        if (currentOverlay.type === 'banner')
          setBanners({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'badge')
          setBadges({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'chat')
          setChats({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
      }
      //Publish new Banner
      setBanner({ published: true });
      meetingClient?.publishOverlay({
        ...banner,
        type: 'banner',
        height: bannerRef?.current?.offsetHeight,
        published: true
      });
    }
  }

  return (
    <ListItem
      bg="#888888"
      w="100%"
      p="0.8rem"
      color="white"
      key={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      _hover={{ opacity: 1 }}
      ref={bannerRef}
      borderRadius="5px"
    >
      <Center>
        <Text fontSize="md" fontWeight="400" color={hovered ? "gray.500" : "white"}>
          {message}
        </Text>
        <MouseHoverButtons isPublished={published} isHovered={hovered} toggleOverlay={toggleBanner} />
      </Center>
    </ListItem>
  );
};

export default Banner;