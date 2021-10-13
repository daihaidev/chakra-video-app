import * as React from 'react';
import { Box, Text, Center } from "@chakra-ui/react";
import { OverlayModel } from '../../../recoil/atoms/overlay/types';

const BannerOverlay = ({ id, message }: OverlayModel) => {
  return (
    <Box
      id={id}
      bg="#888888"
      w="100%"
      p="0.8rem"
      color="white"
      borderRadius="5px"
      roundedBottomLeft={'none'}
      roundedTopLeft={'none'}
    >
      <Center>
        <Text fontSize="md" fontWeight="400" color="white">
          {message}
        </Text>
      </Center>
    </Box>
  );
};
export default BannerOverlay;