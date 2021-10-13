import * as React from 'react';
import { Image } from "@chakra-ui/react"
import { roomSelector } from '../../recoil/atoms/room';
import { useRecoilValue } from 'recoil';

export const LogoOverlay = () => {

  const room = useRecoilValue(roomSelector);
  if (room?.branding?.showLogo) return null;

  return (
    <Image
      src={room?.branding?.logo}
      alt="Brand Logo"
      background="transparent"
      pos="relative"
      top="calc((1/11) * (16 * 56vh / 9))"
      left="calc( (-9/20) * (16 * 56vh / 9))"
      width="calc(.075 * 16 * 56vh / 9)"
      display="flex"
      flexDirection="row"
      zIndex="1000000"
      marginTop="calc(-1 * (.078) * (16 * 56vh / 9))"
    />
  );
};
export default LogoOverlay;