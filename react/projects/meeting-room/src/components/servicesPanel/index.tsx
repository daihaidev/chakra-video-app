import * as React from 'react';
import { Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Container } from "@chakra-ui/react"
import { UserList } from './userList';
import { Chat } from './chat';
import { FaUsers, FaCommentAlt, FaWindowMaximize, FaStore, FaShoppingCart } from "react-icons/fa";
import { currentUserIdAtom, usersSelector } from "../../recoil/atoms/users";
import { useRecoilValue } from 'recoil';
import { hasPermission } from '../../util';
import BannersList from './banners';
import BadgesList from './badges';
import Checkout from './checkout';
import { chatIdsSelector } from '../../recoil/atoms/chats';

const UserPermission = window.MeetOnline.UserPermission;
const UserType = window.MeetOnline.UserType;

const moderatorView = (chatCount: number) => {
  return (
    <Tabs variant="line" orientation="vertical" h="100vh">
      <TabPanels minW="350px">
        <TabPanel>
          <UserList />
        </TabPanel>
        <TabPanel>
          <Chat />
        </TabPanel>
        <TabPanel>
          <BannersList />
        </TabPanel>
        <TabPanel>
          <BadgesList />
        </TabPanel>
        <TabPanel display="none">
          <Checkout />
        </TabPanel>
      </TabPanels>
      <TabList textColor="gray.500" bg="#fff" minW="75px">
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaUsers size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Users</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaCommentAlt size="1.4em" />
              <Text fontSize="xs" color="white" p="0" m="0" pos="absolute">{chatCount}</Text>
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm" display="inline">Chat</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaWindowMaximize size="1.4em" style={{ transform: "rotateZ(180deg)" }} />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Banners</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaStore size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">LiveSell</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display="none" _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaShoppingCart size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Checkout</Text>
            </Container>
          </VStack>
        </Tab>
      </TabList>
    </Tabs>
  );
}


const broadcaterView = (chatCount: number, hasChatPermission: boolean, hasUserListPermission: boolean, hasBannerPermission: boolean, hasLivesellPermission: boolean) => {
  return (
    <Tabs variant="line" orientation="vertical" h="100vh">
      <TabPanels minW="350px">
        <TabPanel>
          <UserList display={hasUserListPermission !== true ? 'none' : 'block'} />
        </TabPanel>
        <TabPanel>
          <Chat display={hasChatPermission !== true ? 'none' : 'block'} />
        </TabPanel>
        <TabPanel display={hasBannerPermission !== true ? 'none' : 'block'}>
          <BannersList />
        </TabPanel>
        <TabPanel display={hasLivesellPermission !== true ? 'none' : 'block'}>
          <BadgesList />
        </TabPanel>
        <TabPanel display="none">
          <Checkout />
        </TabPanel>
      </TabPanels>
      <TabList textColor="gray.500" bg="#fff" minW="75px">
        <Tab display={hasUserListPermission !== true ? 'none' : 'block'} _focus={{}} _selected={{borderColor: '#000', textColor: "#000"}} _hover={{textColor: "#000"}}>
          <VStack>
            <Container p="0" centerContent>
              <FaUsers size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Users</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display={hasChatPermission !== true ? 'none' : 'block'} _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaCommentAlt size="1.4em" />
              <Text fontSize="xs" color="white" p="0" m="0" pos="absolute">{chatCount}</Text>
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Chat</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display={hasBannerPermission !== true ? 'none' : 'block'} _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaWindowMaximize size="1.4em" style={{ transform: "rotateZ(180deg)" }} />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Banners</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display={hasLivesellPermission !== true ? 'none' : 'block'} _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaStore size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">LiveSell</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display="none" _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaShoppingCart size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Checkout</Text>
            </Container>
          </VStack>
        </Tab>
      </TabList>
    </Tabs>
  );
}

let audienceView = (chatCount: number) => {
  return (
    <Tabs variant="line" orientation="vertical" h="100vh">
      <TabPanels minW="350px">
        <TabPanel>
          <UserList />
        </TabPanel>
        <TabPanel>
          <Chat />
        </TabPanel>
        <TabPanel display="none">
          <Checkout />
        </TabPanel>
      </TabPanels>
      <TabList textColor="gray.500" bg="#fff" minW="75px">
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaUsers size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Users</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaCommentAlt size="1.4em" />
              <Text fontSize="xs" color="white" p="0" m="0" pos="absolute">{chatCount}</Text>
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Chat</Text>
            </Container>
          </VStack>
        </Tab>
        <Tab display="none" _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaShoppingCart size="1.4em" />
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Checkout</Text>
            </Container>
          </VStack>
        </Tab>
      </TabList>
    </Tabs>
  );
}

let audienceViewChatOnly = (chatCount: number) => {
  return (
    <Tabs variant="line" orientation="vertical" h="100vh">
      <TabPanels minW="350px">
        <TabPanel>
          <Chat />
        </TabPanel>
        <TabPanel display="none">
          <Checkout />
        </TabPanel>
      </TabPanels>
      <TabList textColor="gray.500" bg="#fff" minW="75px">
        <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
          <VStack>
            <Container p="0" centerContent>
              <FaCommentAlt size="1.4em" />
              <Text fontSize="xs" color="white" p="0" m="0" pos="absolute">{chatCount}</Text>
            </Container>
            <Container p="0" centerContent>
              <Text fontSize="sm">Chat</Text>
            </Container>
          </VStack>
        </Tab>
      </TabList>
    </Tabs>
  );
}

let audienceViewUserListOnly = (
  <Tabs variant="line" orientation="vertical" h="100vh">
    <TabPanels minW="350px">
      <TabPanel>
        <UserList />
      </TabPanel>
      <TabPanel display="none">
        <Checkout />
      </TabPanel>
    </TabPanels>
    <TabList textColor="gray.500" bg="#fff" minW="75px">
      <Tab _focus={{}} _selected={{ borderColor: '#000', textColor: "#000" }} _hover={{ textColor: "#000" }}>
        <VStack>
          <Container p="0" centerContent>
            <FaUsers size="1.4em" />
          </Container>
          <Container p="0" centerContent>
            <Text fontSize="sm">Users</Text>
          </Container>
        </VStack>
      </Tab>
    </TabList>
  </Tabs>
);

let audienceNoTab = (
  <Tabs variant="line" orientation="vertical" h="100vh">
    <TabPanels minW="350px">
      <TabPanel display="none">
        <Checkout />
      </TabPanel>
    </TabPanels>
    <TabList display="none" textColor="gray.500" bg="#fff" minW="75px">

    </TabList>
  </Tabs>
);


export const ServicesPanel = () => {

  const _currentUserId = useRecoilValue(currentUserIdAtom);
  const _currentUser = useRecoilValue(usersSelector(_currentUserId));

  const allChatIds = useRecoilValue(chatIdsSelector) as string[];
  let chatCount = allChatIds.length;

  if (_currentUser.type === UserType.AUDIENCE) {

    if (hasPermission(_currentUser, UserPermission.canUseChat) && hasPermission(_currentUser, UserPermission.canSeeUserList)) {
      return audienceView(chatCount);
    }
    if (hasPermission(_currentUser, UserPermission.canUseChat)) {
      return audienceViewChatOnly(chatCount);
    }
    if (hasPermission(_currentUser, UserPermission.canSeeUserList)) {
      return audienceViewUserListOnly;
    }
    return audienceNoTab;
  }

  if (_currentUser.type === UserType.BROADCASTER) {
    const hasBannerPermission = hasPermission(_currentUser, UserPermission.canSeeBannersList);
    const hasLivesellPermission = hasPermission(_currentUser, UserPermission.canSeeLiveSellProducts);
    const hasChatPermission = hasPermission(_currentUser, UserPermission.canUseChat);
    const hasUserListPermission = hasPermission(_currentUser, UserPermission.canSeeUserList);

    return broadcaterView(chatCount, hasChatPermission, hasUserListPermission, hasBannerPermission, hasLivesellPermission);
    // if (hasPermission(_currentUser, UserPermission.canUseChat) && hasPermission(_currentUser, UserPermission.canSeeUserList) ) {
    //   return broadcaterView(chatCount, hasBannerPermission, hasLivesellPermission);
    // }
    // if (hasPermission(_currentUser, UserPermission.canUseChat)) {
    //   return broadcasterViewChatOnly(chatCount, hasBannerPermission, hasLivesellPermission);
    // }
    // if (hasPermission(_currentUser, UserPermission.canSeeUserList) ) {
    //   return broadcaterViewUserListOnly(hasBannerPermission, hasLivesellPermission);
    // }


    
  }

  if (_currentUser.type === UserType.MODERATOR) {
    return moderatorView(chatCount);
  }

  return audienceView(chatCount);
};