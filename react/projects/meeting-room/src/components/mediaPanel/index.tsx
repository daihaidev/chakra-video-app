// @flow 
import * as React from 'react';
import LogoOverlay from './_logoOverlay';
import ScreenOverlay from './_screenOverlay';
import MainMediaScreen from './_mainMediaScreen';
import PrevSpeakerStreams from './_prevSpeakerStreams';
import ButtonsLocalView from './buttonsLocalView';
import ButtonsRemoteView from './buttonsRemoteView';
import CornerSettingButton from './_cornerSettingButton';
import { Box } from '@chakra-ui/layout';


export const MediaPanel = () => {
  return (
    <>
      <Box d="flex" flexDir="column" height="70vh" w="56vw" margin="auto" minW="738px" maxW="1000px" alignItems="center">
        <LogoOverlay />
        <MainMediaScreen />
        <ScreenOverlay />
        <ButtonsRemoteView />
        <PrevSpeakerStreams />
      </Box>
      <Box pos="absolute" left="1rem" bottom="0" minW="768px" w="calc(66.66vw - 1rem)" pl="0px" pr="32px" pb="10px">
        <CornerSettingButton />
        <ButtonsLocalView />
      </Box>
    </>
  );
};