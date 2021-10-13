import * as React from 'react';
import {
  Box,
  Flex,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Center,
  Button
} from '@chakra-ui/react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { badgesSelector, badgeIdsSelector } from '../../../recoil/atoms/badges';
import { bannerIdsSelector } from '../../../recoil/atoms/banners';
import { chatIdsSelector } from '../../../recoil/atoms/chats';
import { overlaySelector } from '../../../recoil/atoms/overlay';
import { popupSelector } from '../../../recoil/atoms/popup';
import MouseHoverButtons from '../../common/mouseHoverButtons';
import { SDKContext } from '../../../context/SDKContext';
import { EmailIcon } from '@chakra-ui/icons';
import { BadgeModel } from '../../../recoil/atoms/badges/types';

interface BadgeProps {
  badgeId: string;
}

const Badge = ({ badgeId }: BadgeProps) => {
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [badge, setBadge] = useRecoilState(badgesSelector(badgeId));
  const setBanners = useSetRecoilState(bannerIdsSelector);
  const setBadges = useSetRecoilState(badgeIdsSelector);
  const setChats = useSetRecoilState(chatIdsSelector);
  const setPopup = useSetRecoilState(popupSelector);
  const { id, title, description, currentPrice, oldPrice, image, sellerEmail, published, buttonText } = badge as BadgeModel;

  const currentOverlay = useRecoilValue(overlaySelector);
  const meetingClient = React.useContext(SDKContext);

  const toggleBadge = () => {
    if (published) {
      setBadge({ published: false });
      meetingClient?.unPublishOverlay(currentOverlay?.id);
    }
    else {
      if (currentOverlay) {
        if (currentOverlay.type === 'banner')
          setBanners({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'badge')
          setBadges({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
        if (currentOverlay.type === 'chat')
          setChats({ name: 'UPDATE', id: currentOverlay.id, attributes: { published: false } });
      }
      //Publish new Badge
      setBadge({ published: true });
      meetingClient?.publishOverlay({
        ...badge,
        type: 'badge',
        height: badgeRef?.current?.offsetHeight,
        published: true
      });
    }
  }

  return (
    <Stat
      key={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      _hover={{ opacity: 0.8 }}
      ref={badgeRef}
      px={{ base: 2, md: 2 }}
      py={'2'}
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.300"
      rounded={'lg'}
    >
      <Flex justifyContent='space-between'>
        <Box my={'auto'} alignContent={'center'}>
          <Image src={image} alt={title} boxSize="65px" objectFit="cover" opacity={hovered ? '0.2' : 1} />
        </Box>
        <Center pos="absolute" left={(badgeRef?.current?.offsetWidth || 0) / 2} top={(badgeRef?.current?.offsetHeight || 0) / 2}>
          <MouseHoverButtons isPublished={published} isHovered={hovered} toggleOverlay={toggleBadge} />
        </Center>
        <Box pl="0.5rem" w="65%" opacity={hovered ? '0.2' : 1}>
          <StatLabel fontWeight={'medium'} isTruncated>{title}</StatLabel>
          <StatHelpText maxHeight="85px" overflowY="auto">{description}</StatHelpText>
          <StatNumber fontSize={'md'} fontWeight={'medium'} display={'inline'} mr={'0.6rem'}>
            {currentPrice}
          </StatNumber>
          <StatNumber fontSize={'md'} fontWeight={'medium'} textDecoration={'line-through'} color={'red.600'} display={'inline'} mr={'0.6rem'}>
            {oldPrice}
          </StatNumber>
          {/* <Text fontWeight={400} fontSize={'md'} color={'gray.600'} display={'inline'}>
                            (inc.tax)
                        </Text> */}
          {
            // Show email icon only if email is available.
            (!!sellerEmail) ?
              <Text fontWeight={400} fontSize={'xs'} color={'tomato'} textDecoration={'underline'}>
                <EmailIcon mr="0.4rem" />{sellerEmail}
              </Text>
              : null
          }

        </Box>
        <Box mt="auto" alignContent={'end'}>
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={() => setPopup(badge)}
          >
            {buttonText}
          </Button>
        </Box>
      </Flex>
    </Stat>
  );
};

export default Badge;