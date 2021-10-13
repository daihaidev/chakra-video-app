import * as React from 'react';
import { GridItem, Checkbox, SimpleGrid, Avatar, Text, Stack, Link, HStack, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";
import { FaMicrophoneSlash, FaMicrophone, FaVideoSlash, FaVideo } from "react-icons/fa";
import { IoMdHand } from "react-icons/io";
import { useRecoilValue } from 'recoil';
import { hasPermission } from '../../../util';
import { usersSelector, currentUserIdAtom } from '../../../recoil/atoms/users';
import { SDKContext } from "../../../context/SDKContext";

const UserType = window.MeetOnline.UserType;
const UserPermission = window.MeetOnline.UserPermission;

interface UserModeratorViewProps {
  userId: string;
  isLast: boolean;
}

export const UserModeratorView = ({ userId, isLast }: UserModeratorViewProps) => {
  const meetingClient = React.useContext(SDKContext);
  const _currentUserId = useRecoilValue(currentUserIdAtom);

  const user = useRecoilValue(usersSelector(userId));
  console.log("PARTICIPANTS LIST - user = ", user);

  const { id, name, type, permissions, micEnabled, camEnabled, handUp, photo1 } = user;
  console.log("USER - Permissions = ", permissions);

  const requestMicToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    meetingClient?.toggleMic(micEnabled, id);
  }
  const requestCamToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    meetingClient?.toggleCam(camEnabled, id);
  }
  const dropHand = (event: React.MouseEvent) => {
    event.stopPropagation();
    meetingClient?.sendHandRaised(false, id);
  }


  let micDisplay = micEnabled ? <FaMicrophone size="1.3em" /> : <FaMicrophoneSlash size="1.3em" />;
  let camDisplay = camEnabled ? <FaVideo size="1.3em" /> : <FaVideoSlash size="1.3em" />;
  let handRaisedDisplay = handUp === true ? <IoMdHand size="1.3em" color="#FFD700" /> : null;

  if (userId !== _currentUserId) {
    micDisplay = micEnabled ?
      <Link onClick={requestMicToggle} color="teal">
        <FaMicrophone size="1.3em" />
      </Link>
      :
      <FaMicrophoneSlash size="1.3em" />
      ;

    camDisplay = camEnabled ?
      <Link onClick={requestCamToggle} color="teal">
        <FaVideo size="1.3em" />
      </Link>
      :
      <FaVideoSlash size="1.3em" />
      ;

    handRaisedDisplay = handUp === true ?
      <Link onClick={dropHand} color="teal">
        <IoMdHand size="1.3em" color="#FFD700" />
      </Link>
      : null;

  }

  if (type === UserType.MODERATOR) {
    return (
      <AccordionItem borderStyle="none" allowtoggle="true">
        <AccordionButton
          bg="gray.100"
          w="100%"
          p="0.5rem"
          color="blackAlpha.800"
          borderRadius="5px"
          key={id}
          _expanded={{}}
          cursor="default"
          mb={isLast ? '0px' : '2px'}
          _hover={{}}
          _focus={{}}
        >

          <Stack direction="row" align="center" key={id}>
            <HStack w={handUp ? '18.5vw' : '20.3vw'}>
              <Avatar name={name} ml="0.3rem" size="sm" src={photo1} />
              <Text fontSize="sm" fontWeight="400">{name}</Text>
            </HStack>
            <HStack color="gray.500">
              {handRaisedDisplay}
              {micDisplay}
              {camDisplay}
            </HStack>
          </Stack>
        </AccordionButton>
      </AccordionItem>
    )
  }

  if (type === UserType.BROADCASTER) {
    return (
      <AccordionItem borderStyle="none" borderRadius="5px">
        <AccordionButton
          bg="gray.100"
          w="100%"
          p="0.5rem"
          color="blackAlpha.800"
          borderRadius="5px"
          key={id}
          _expanded={{ bg: "inherit" }}
          mb={isLast ? '0px' : '2px'}
        >

          <Stack direction="row" align="center" key={id}>
            <HStack w="20.3vw">
              <Avatar name={name} ml="0.3rem" size="sm" src={photo1} />
              <Text fontSize="sm" fontWeight="400">{name}</Text>
            </HStack>
            <HStack color="gray.500">
              {handRaisedDisplay}
              {micDisplay}
              {camDisplay}
            </HStack>
          </Stack>
        </AccordionButton>
        <AccordionPanel pb={4}>
          <SimpleGrid columns={1} spacing={3} px="0.4rem">
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canSeeUserList)}
                value={UserPermission.canSeeUserList}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canSeeUserList)}
              >
                <Text fontSize="sm">View Participant List</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canUseChat)}
                value={UserPermission.canUseChat}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseChat)}
              >
                <Text fontSize="sm">View Chat</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canRaiseHand)}
                value={UserPermission.canRaiseHand}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canRaiseHand)}
              >
                <Text fontSize="sm">Allow Raise Hand</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canUseCam)}
                value={UserPermission.canUseCam}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseCam)}
              >
                <Text fontSize="sm">Allow Cam Toggle (On/Off)</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canUseMic)}
                value={UserPermission.canUseMic}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseMic)}
              >
                <Text fontSize="sm">Allow Mic Toggle (On/Off)</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canUseScreenshare)}
                value={UserPermission.canUseScreenshare}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseScreenshare)}
              >
                <Text fontSize="sm">Allow Screen Share</Text>
              </Checkbox>
            </GridItem>
            <GridItem>
              <Checkbox
                colorScheme="gray"
                isChecked={hasPermission(user, UserPermission.canSeeSettingButton)}
                value={UserPermission.canSeeSettingButton}
                onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canSeeSettingButton)}
              >
                <Text fontSize="sm">Allow Settings Button</Text>
              </Checkbox>
            </GridItem>
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    );
  }

  //ELSE AUDIENCE
  return (
    <AccordionItem borderStyle="none" borderRadius="5px">
      <AccordionButton
        bg="gray.100"
        w="100%"
        p="0.5rem"
        color="blackAlpha.800"
        borderRadius="5px"
        key={id}
        _expanded={{ bg: "inherit" }}
        mb={isLast ? '0px' : '2px'}
      >

        <Stack direction="row" align="center" key={id}>
          <HStack w={handUp ? '18.5vw' : '20.3vw'}>
            <Avatar name={name} ml="0.3rem" size="sm" src={photo1} />
            <Text fontSize="sm" fontWeight="400">{name}</Text>
          </HStack>
          <HStack color="gray.500">
            {handRaisedDisplay}
            {micDisplay}
            {camDisplay}
          </HStack>
        </Stack>
      </AccordionButton>
      <AccordionPanel pb={4}>
        <SimpleGrid columns={1} spacing={3} px="0.4rem">
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canSeeUserList)}
              value={UserPermission.canSeeUserList}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canSeeUserList)}
            >
              <Text fontSize="sm">View Participant List</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canUseChat)}
              value={UserPermission.canUseChat}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseChat)}
            >
              <Text fontSize="sm">View Chat</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canRaiseHand)}
              value={UserPermission.canRaiseHand}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canRaiseHand)}
            >
              <Text fontSize="sm">Allow Raise Hand</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canUseCam)}
              value={UserPermission.canUseCam}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseCam)}
            >
              <Text fontSize="sm">Allow Cam Toggle (On/Off)</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canUseMic)}
              value={UserPermission.canUseMic}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseMic)}
            >
              <Text fontSize="sm">Allow Mic Toggle (On/Off)</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canUseScreenshare)}
              value={UserPermission.canUseScreenshare}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canUseScreenshare)}
            >
              <Text fontSize="sm">Allow Screen Share</Text>
            </Checkbox>
          </GridItem>
          <GridItem>
            <Checkbox
              colorScheme="gray"
              isChecked={hasPermission(user, UserPermission.canSeeSettingButton)}
              value={UserPermission.canSeeSettingButton}
              onChange={() => meetingClient?.togglePermission(id, permissions, UserPermission.canSeeSettingButton)}
            >
              <Text fontSize="sm">Allow Settings Button</Text>
            </Checkbox>
          </GridItem>
          {/* <GridItem>
                        <Checkbox 
                            colorScheme="gray" 
                            isChecked={isPromotedToBroadcaster === true} 
                            value={isPromotedToBroadcaster} 
                            onChange={() => meetingClient.togglePromotion(id, UserType.BROADCASTER)}
                            isDisabled={true}
                        >
                            <Text fontSize="sm">Promote to Broadcaster</Text>
                        </Checkbox>
                    </GridItem>
                    <GridItem>
                        <Checkbox 
                            colorScheme="gray" 
                            isChecked={isPromotedToModerator === true} 
                            value={isPromotedToModerator} 
                            onChange={() => meetingClient.togglePromotion(id, UserType.MODERATOR)}
                            isDisabled={true}
                        >
                            <Text fontSize="sm">Promote to Moderator</Text>
                        </Checkbox>
                    </GridItem> */}
        </SimpleGrid>
      </AccordionPanel>
    </AccordionItem>
  );
}


