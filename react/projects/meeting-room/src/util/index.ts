/**
 * Copyright (c) 2021 MeetOnline.IO
 *
 * long description for the file
 *
 * @summary UTIL.js having utility functions
 * @author Rishabh <rishabh.it.007@gmail.com>
 *
 * Created at     : 2021-02-26 12:00:00 
 * Last modified  : 2021-02-26 12:00:00 
 */
import dayjs from 'dayjs';
import is_mobile from 'ismobilejs';
import { UserModel } from '../recoil/atoms/users/types';
import { LinkElement } from '../types';

const deviceQueryObject = is_mobile(navigator.userAgent);
export const now = () => dayjs().format("yyyy-MM-dd HH:mm:ss");
export const currentTime = () => dayjs().format("HH:mm a");
export const currentDay = () => dayjs().format('dddd');
export const currentDate = () => dayjs().format("DD MMMM YYYY");
export const currentYear = () => dayjs().format("YYYY");

export const formatTime = (time: string) => dayjs(time).format("HH:mm a");

export const isMobile = () => deviceQueryObject.any && !deviceQueryObject.tablet;
export const isTablet = () => deviceQueryObject.any && deviceQueryObject.tablet;
export const isMobileORTablet = () => deviceQueryObject.any || deviceQueryObject.tablet;

const compare = (a: any, b: any, key: string | number) => {
  if (a[key] < b[key]) {
    return -1;
  }
  if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}

export const userSorter = (u1: UserModel, u2: UserModel) => {

  console.log("u1 = ", u1);
  console.log("u2 = ", u2);

  if (u1.handUp === true && u2.handUp !== true) {
    return -1;
  }
  if (u1.handUp !== true && u2.handUp === true) {
    return 1;
  }

  if (u1.type === 'MODERATOR' && u1.type !== 'MODERATOR') {
    return -1;
  }
  if (u1.type !== 'MODERATOR' && u1.type === 'MODERATOR') {
    return 1;
  }
  if (u1.type === 'MODERATOR' && u1.type === 'MODERATOR') {
    return compare(u1, u2, 'name');
  }

  if (u1.type === 'BROADCASTER' && u1.type !== 'BROADCASTER') {
    return -1;
  }
  if (u1.type !== 'BROADCASTER' && u1.type === 'BROADCASTER') {
    return 1;
  }
  if (u1.type === 'BROADCASTER' && u1.type === 'BROADCASTER') {
    return compare(u1, u2, 'name');
  }

  return compare(u1, u2, 'name');
}

export const hasPermission = (userObj: UserModel, permission) => {
  return ((userObj.permissions & permission) !== 0);
}

export const setPageAttributes = ({ pageTitle = '', pageFavicon = '' }) => {
  //Page Title
  document.title = pageTitle;

  //Page Favicon
  let link: LinkElement = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = pageFavicon;
}
