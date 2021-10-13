import { DefaultValue } from "recoil";

export interface RoomEntity {
  name: string;
  roomHash: string;
  roomSessionId: string;
}

export interface RoomBranding {
  badgeBackgroundColor: string;
  badgeBorderColor: string;
  badgeButtonBackgroundColor: string;
  badgeButtonBorderColor: string;
  badgeButtonFontFamily: string;
  badgeButtonTextColor: string;
  badgeFontFamily: string;
  badgeTextColor: string;
  bannerBackgroundColor: string;
  bannerBorderColor: string;
  bannerFontFamily: string;
  bannerFontStyle: string;
  bannerFontWeight: string;
  bannerTextColor: string;
  commentBackgroundColor: string;
  commentBorderColor: string;
  commentFontFamily: string;
  commentTextColor: string;
  customerId: string;
  logo: string;
  pageFavicon: string;
  pageTitle: string;
  roomBackgroundColor: string;
  roomBackgroundImage: string;
  roomHeaderColor: string;
  roomHeaderIcon: string;
  showLogo: string;
}

export interface Room extends RoomEntity {
  branding: RoomBranding;
}

export interface RoomIdsSetterAction extends DefaultValue{
  name: string;
  attributes: {
    published: boolean
  }
}