import { DefaultValue } from "recoil";

export interface UserModel {
  id: string;
  sessionId: string;
  mediaConnected?: boolean;
  screenShareEnabled?: boolean;
  name: string;
  photo1: string;
  camEnabled?: boolean;
  type: string;
  permissions: number;
  micEnabled?: boolean;
  handUp?: boolean;
  isPromotedToBroadcaster?: boolean;
  isPromotedToModerator?: boolean;
  isModerator: boolean;
}

export interface UserIdsSetterAction {
  name: string;
  userId?: string;
  attributes: {
    published: boolean
  }
  users: UserModel[]
}