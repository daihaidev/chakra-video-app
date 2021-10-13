// @flow 
import { Box } from '@chakra-ui/layout';
import * as React from 'react';
import { overlaySelector } from '../../recoil/atoms/overlay';
import { useRecoilValue } from 'recoil';
import BannerOverlay from '../servicesPanel/banners/_bannerOverlay';
import ChatOverlay from '../servicesPanel/chat/_chatOverlay';
import BadgeOverlay from '../servicesPanel/badges/_badgeOverlay';

const ScreenOverlay = () => {
  const _overlay_ = useRecoilValue(overlaySelector);
  if (_overlay_ === null) return null;
  const { type, height } = _overlay_;

  let overlayCmp = null;
  if (type === 'banner') {
    overlayCmp = (<BannerOverlay {..._overlay_} />);

  } else if (type === 'chat') {
    overlayCmp = (<ChatOverlay {..._overlay_} />);
  }
  else if (type === 'badge') {
    overlayCmp = (<BadgeOverlay {..._overlay_} />);
  }

  return (
    <Box
      w="calc(1/2 * 16 * 56vh / 9)"
      height="auto"
      pos="relative"
      left="calc( (-1/4) * (16 * 56vh / 9))"
      display="flex"
      flexDirection="row"
      zIndex="1000000"
      p="0"
      m="0"
      marginTop={-1 * (height + 12)}
    >
      {overlayCmp}
    </Box>
  );
};
export default ScreenOverlay;

