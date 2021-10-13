import React, { ReactNode } from "react";
import { defaultRoom, roomSelector } from "../recoil/atoms/room";
import { userIdsSelector } from "../recoil/atoms/users";
import { currentUserIdAtom } from "../recoil/atoms/users";
import { chatIdsSelector } from "../recoil/atoms/chats";
import { viewSelector } from "../recoil/atoms/view";
import { activeSpeakerSelector, defaultActiveSpeaker } from "../recoil/atoms/activeSpeaker";
import { errorSelector } from "../recoil/atoms/error";
import { joinButtonLoadingSelector } from "../recoil/atoms/joinButton";
import { screenShareUserSelector } from "../recoil/atoms/screenShareUser";
import { bannerIdsSelector, dummyBanners } from "../recoil/atoms/banners";
import { badgeIdsSelector } from "../recoil/atoms/badges";
import { overlaySelector } from "../recoil/atoms/overlay";
import { heartAnimationSelector } from "../recoil/atoms/heartAnimation";
import useQuery from '../hooks/useQuery';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { Views } from '../constants';
import * as Util from "../util";
import { MessageCategory } from "../types";
import { Room, RoomBranding, RoomEntity } from "../recoil/atoms/room/types";
import { OverlayModel } from "../recoil/atoms/overlay/types";

declare global {
  interface Window { MeetOnline: any; }
}

interface User {
  id: string;
  deviceType: string;
  ipAddress: string;
  name: string;
  permissions: number;
  photo: string;
  sessionId: string;
  status: string;
  type: string;
}

interface RoomValidationResult {
  messasgeType: MessageCategory;
  status: string;
  room: Room;
  user?: User
}

interface RoomResult extends RoomEntity {
  id: string;
  assignedGateway: string;
  userCount: number;
}

interface RoomEventResponse {
  messageType: MessageCategory;
  status: string;
  user: User;
  room: RoomResult
}

interface ConnectingResponse {
  uid: string;
  type: string;
}

interface PublishingResponse {
  uid: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

interface ChattingEntity {
  roomBranding: Partial<RoomBranding>;
  users: User[];
  activeSpeakerUid: string;
  chats: ChatModel[];
  products: any[]; //TODO: udpate types when update products recoil
  overlay?: OverlayModel;
}

interface OpeningResponse extends RoomResult {
  branding: RoomBranding;
  data: ChattingEntity;
  messageType?: MessageCategory;
}

interface ChatModel {
  id: string;
  model: string;
  properties: OverlayModel;
}

interface ModelUpdatingResponse {
  messageType: MessageCategory;
  roomSessionId: string;
  status: string;
  data: ChatModel
}

interface MediaTrackType {
  audioTrack: any;
  videoTrack: any;
}

const MeetOnline = window.MeetOnline;
const MessageType = MeetOnline.MessageType;
const EventType = MeetOnline.EventType;
const ModelType = MeetOnline.ModelType;

type SDKContextProviderProps = {
  children: ReactNode;
};

interface RTCHandler {
  requestScreenShare: () => void;
}

interface SDKContextType {
  setUserName: (name: string) => void;
  connectGateway: () => void;
  disconnectGateway: (value: number) => void;
  sendPublicChat: (text: string) => void;
  sendHandRaised: (handRaised: boolean, id?: string) => void;
  toggleHeartAnimation: (isHeartAnimating: boolean) => void;
  validateAndGetRoomBranding: () => RoomValidationResult;
  getMediaTracks: (uid: string) => MediaTrackType;
  toggleMic: (enabled: boolean, id?: string) => void;
  toggleCam: (enabled: boolean, id?: string) => void;
  unPublishOverlay: (id: string) => void;
  publishOverlay: (overlay: Partial<OverlayModel>) => void;
  togglePermission: (id: string, permissions: any, permission: any) => void; //TODO: update permissions and permission once its type is checked
  rtc?: RTCHandler;
}

interface SDKResponse {
  uid: string;
  reason: string;
  error: string;
  message: string;
  messageType: MessageCategory;
}

export const SDKContext = React.createContext<SDKContextType | null>(null);

let [_room, setRoom] = [defaultRoom, (_: any) => { }];
let [_activeSpeaker, setActiveSpeaker] = [defaultActiveSpeaker, (_: any) => { }];
let _currentUserId: string | null = '';

export const SDKContextProvider = (props: SDKContextProviderProps) => {
  const query = useQuery();
  [_room, setRoom] = useRecoilState(roomSelector);
  const setUsers = useSetRecoilState(userIdsSelector);
  const setChats = useSetRecoilState(chatIdsSelector);
  const setView = useSetRecoilState(viewSelector);
  [_activeSpeaker, setActiveSpeaker] = useRecoilState(activeSpeakerSelector);
  _currentUserId = useRecoilValue(currentUserIdAtom);
  const setScreenShareUser = useSetRecoilState(screenShareUserSelector);
  const setError = useSetRecoilState(errorSelector);
  const setJoinButtonLoading = useSetRecoilState(joinButtonLoadingSelector);
  const setBanners = useSetRecoilState(bannerIdsSelector);
  const setBadges = useSetRecoilState(badgeIdsSelector);
  const setOverlay = useSetRecoilState(overlaySelector);
  const setHeartAnimation = useSetRecoilState(heartAnimationSelector);
  const [meetingClient, setMeetingClient] = React.useState<SDKContextType | null>(null)

  const initSDK = () => {
    const _meetingClient = MeetOnline.createClient({
      userName: query.userName,
      roomHash: query.roomHash,
    });
    _meetingClient.on(EventType.Auth, authEventsCB);
    _meetingClient.on(EventType.WebSocket, wsEventsCB);
    _meetingClient.on(EventType.Media, mediaEventsCB);
    console.log("initSDK ----_meetingClient = ", _meetingClient);

    //_meetingClient.connectGateway(); ----Will be called onClick to JOIN
    return _meetingClient;
  };

  const validateRoom = async () => {
    if (meetingClient) {
      const resp = await meetingClient.validateAndGetRoomBranding();
      console.log("SDKContext validateRoom - resp - ", resp);
      if (resp.status === 'OK') {
        setRoom({ name: 'ADD', attributes: resp.room });
        Util.setPageAttributes(resp.room.branding);
        setView(Views.HOME);
      } else {
        setView(Views.NOT_FOUND);
      }
    }
  }

  const w1 = (response: OpeningResponse) => {
    handleConnect(response);
  };

  const w2 = (response: any) => {
    let { messageType } = response;

    switch (messageType) {
      case MessageType.connect:
        handleConnect(response as OpeningResponse);
        break;
      case MessageType.modelUpdate:
        handleModelUpdate(response as ModelUpdatingResponse);
        break;
      default:
        handleModelUpdate(response as ModelUpdatingResponse);
    }
  };

  const w3 = (response: RoomEventResponse) => {
    console.log("CB----w3----", response);
  };

  const w4 = (response: RoomEventResponse) => {
    console.log("CB----w4----", response);
    setChats({ name: 'RESET' });
    setUsers({ name: 'RESET' });
    setBadges({ name: 'RESET' });
    setBanners({ name: 'RESET' });
    //setRoom({name: 'RESET'});
  };

  const a1 = (response: RoomEventResponse) => {
    console.log("CB----a1----", response);
    //setJoinButtonLoading(false);
    setRoom({ name: 'UPDATE', attributes: response.room });
    setUsers({ name: 'ADD', users: [response.user] });
  };

  const a2 = (response: SDKResponse) => {
    console.log("CB----a2----", response);
    setJoinButtonLoading(false);
    setError({ title: response.error, message: response.reason });
  };

  const m1 = (response: ConnectingResponse) => {
    console.log("CB----m1--RTC USER CONNECTED--", response);
    setUsers({ name: 'UPDATE', userId: response.uid, attributes: { mediaConnected: true, micEnabled: true, camEnabled: true } });
  };

  const m2 = (response: ConnectingResponse) => {
    console.log("CB----m2--RTC USER DISCONNECTED--", response);
    setUsers({ name: 'UPDATE', userId: response.uid, attributes: { mediaConnected: false, micEnabled: false, camEnabled: false } });
  };

  const m3 = (response: PublishingResponse) => {
    console.log("CB----m3---onPublished-", response);
    setUsers({ name: 'UPDATE', userId: response.uid, attributes: { mediaConnected: true, micEnabled: response.hasAudio, camEnabled: response.hasVideo } });
  };

  const m4 = (response: ConnectingResponse) => {
    console.log("CB----m5----onScreenShareStarted---", response);
    setScreenShareUser(response);
    let associatedUserId = response.uid.replace('ss', '').trim();
    setUsers({ name: 'UPDATE', userId: associatedUserId, attributes: { screenShareEnabled: true } });
  };

  const m5 = (response: ConnectingResponse) => {
    console.log("CB----m5----onScreenShareStopped---", response);
    setScreenShareUser(null);
    let associatedUserId = response.uid.replace('ss', '').trim();
    setUsers({ name: 'UPDATE', userId: associatedUserId, attributes: { screenShareEnabled: false } });
  };

  const m6 = (response: ConnectingResponse) => {
    console.log("CB----m7---onFail-", response);
  };


  let authEventsCB = {
    onSuccess: a1,
    onFail: a2,
  };

  let wsEventsCB = {
    onOpen: w1,
    onMessage: w2,
    onError: w3,
    onClose: w4,
  };

  let mediaEventsCB = {
    onConnected: m1,
    onDisconnected: m2,
    onPublished: m3,
    onScreenShareStarted: m4,
    onScreenShareStopped: m5,
    onFail: m6
  };

  const handleConnect = (resp: OpeningResponse) => {
    console.log("SDKContext INDEX.JS handleConnect - response = ", resp);

    // Add Room Branding
    if (!!query.roomBranding) {
      setRoom({ name: 'UPDATE', attributes: { branding: resp.data.roomBranding } });
      Util.setPageAttributes(resp.data.roomBranding);
    }
    // Add other Users in the room
    setUsers({ name: 'ADD', users: resp.data.users });

    // Set Current Active Speaker from MOG
    let activeSpeakerUid = resp.data.activeSpeakerUid ? resp.data.activeSpeakerUid : _currentUserId;
    setActiveSpeaker({ uid: activeSpeakerUid, type: 'remote' });

    //Add Prev Chat History  
    setChats({ name: 'ADD', chats: resp.data.chats });
    setView(Views.MEETING_ROOM);
    setBanners({ name: 'ADD', banners: dummyBanners }); //Later dummyBanners will come from the server
    setBadges({ name: 'ADD', badges: resp.data.products }); //Later dummyBanners will come from the server
    setOverlay(resp.data.overlay ? resp.data.overlay : null);
    setJoinButtonLoading(false);
  };

  const handleModelUpdate = React.useCallback((response: ModelUpdatingResponse) => {
    console.log("SDKContext INDEX.JS handleModelUpdate - response = ", response,);
    if (response.status !== "OK") {
      console.error("ERROR");
      return;
    }

    if (!_room) {
      console.error("SDKContext => Invalid Room");
      return;
    }
    if (response.roomSessionId !== _room.roomSessionId) {
      console.error("SDKContext => Invalid Room State");
      return;
    }

    switch (response.data.model) {
      case ModelType.user:
        doUserUpdate(response);
        break;

      case ModelType.room:
        doRoomUpdate(response);
        break;

      case ModelType.chat:
        doChatUpdate(response);
        break;

      case ModelType.overlay:
        doOverlayUpdate(response);
        break;

      default:
        console.log("Invalid Model - " + response.data.model);
    }
  }, [_room, meetingClient])

  const doUserUpdate = (resp: ModelUpdatingResponse) => {
    // User Left
    const props = resp.data.properties;
    if (Object.keys(props).length === 0) {
      setUsers({ name: 'REMOVE', users: [{ id: resp.data.id }] });
      if (_activeSpeaker.uid === resp.data.id) { //If active speaker leaves the room suddenly
        setActiveSpeaker({ uid: _currentUserId, type: 'local' })
      }
      return;
    }

    //User Joined
    if (resp.data.id === resp.data.properties.id) {
      const newUserArr = [resp.data.properties]; //As method takes array of users
      setUsers({ name: 'ADD', users: newUserArr });// Add new Joinee

      //Case when 2nd person joins and nobody speaking. We never want to show Current User as Active Speaker until he is alone in the room
      if (_currentUserId === _activeSpeaker.uid) {
        setActiveSpeaker({ uid: resp.data.id, type: 'remote' });
      }
    }
    else { //Update user props like micEnabled etc
      setUsers({ name: 'UPDATE', userId: resp.data.id, attributes: resp.data.properties });

      //toggle mic
      if (resp.data.properties.micEnabled !== undefined && _currentUserId === resp.data.id) {
        (resp.data.properties.micEnabled === true) ? MeetOnline.client().rtc.unmuteAudio() : MeetOnline.client().rtc.muteAudio();
      }

      //toggle cam
      if (resp.data.properties.camEnabled !== undefined && _currentUserId === resp.data.id) {
        (resp.data.properties.camEnabled === true) ? MeetOnline.client().rtc.unmuteVideo() : MeetOnline.client().rtc.muteVideo();
      }

      //Screenshare
      if (resp.data.properties.screenShareEnabled !== undefined && _currentUserId === resp.data.id) {
        MeetOnline.client().rtc.toggleScreenShare(resp.data.properties.screenShareEnabled);
      }
    }
  }

  const doRoomUpdate = (response: ModelUpdatingResponse) => {
    if (response.data.properties.activeSpeakerUid !== undefined) {
      if (response.data.properties.activeSpeakerUid !== _currentUserId) {
        setActiveSpeaker({ uid: response.data.properties.activeSpeakerUid, type: 'remote' });
      }
    }

    if (response.data.properties.heartAnimating !== undefined) {
      setHeartAnimation(response.data.properties.heartAnimating);
    }

  }
  const doChatUpdate = (response: ModelUpdatingResponse) => {
    setChats({ name: 'ADD', chats: [response.data.properties] });
  }

  const doOverlayUpdate = (response: ModelUpdatingResponse) => {
    const props = response.data.properties;
    if (Object.keys(props).length === 0)
      setOverlay(null);
    else
      setOverlay(props);
  }

  React.useEffect(() => {
    const _meetingClient = initSDK();
    setMeetingClient(_meetingClient)
    return () => { };
  }, []);

  React.useEffect(() => {
    if (meetingClient) {
      validateRoom()
    }
  }, [meetingClient])

  return (
    <SDKContext.Provider value={meetingClient} >
      { props.children}
    </SDKContext.Provider>
  );
};

