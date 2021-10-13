import { UserModel } from "../users/types";

export interface OverlayModel {
  id: string;
  type: string;
  height: number;
  micEnabled: boolean;
  camEnabled: boolean;
  screenShareEnabled: boolean;
  activeSpeakerUid: string;
  heartAnimating: boolean;
  message: string;
  author: UserModel;
  timestamp: string;
  published: boolean;
  title: string;
  description: string;
  currentPrice: string;
  oldPrice: string;
  sellerEmail: string;
  image: string;
  checkoutUrl: string;
  buttonText: string;
}