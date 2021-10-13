import * as React from 'react';
import { IconButton, Container } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import {
  Menu,
  MenuButton
} from "@chakra-ui/react";
import { viewSelector } from "../../recoil/atoms/view";
import { useSetRecoilState } from 'recoil';
import { Views } from '../../constants';
import { SDKContext } from '../../context/SDKContext';

export const CornerSettingButton = () => {
  return null;
}

export const CornerSettingButton_COMMENTED = () => {

  const meetingClient = React.useContext(SDKContext);
  const setView = useSetRecoilState(viewSelector);

  React.useEffect(() => {
    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'Q') {
        meetingClient?.disconnectGateway(0);
        setView(Views.BYE);
      }
    });

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', () => 1);
    };
  }, [meetingClient, setView]);

  return (
    <Container style={{ position: 'absolute', bottom: "25px", left: "-17px" }}>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Settings"
          icon={<BsThreeDots />}
          bg="white"
          isRound={true}
          size="sm"
          _focus={{}}
          variant="ghost"
        />
        {/*
            <MenuList>
                <MenuItem icon={<CloseIcon />} onClick={showByePage} command="⌘Q">
                    Leave Meeting
                </MenuItem>
            </MenuList>
            */}
      </Menu>
    </Container>
  );
};
export default CornerSettingButton;