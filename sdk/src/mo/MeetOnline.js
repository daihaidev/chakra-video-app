/* eslint-disable no-undef */
import MOClient from './MOClient';
import MessageType from '../constants/MessageType';
import EventType from '../constants/EventType';
import UserStatus from '../constants/UserStatus';
import UserType from '../constants/UserType';
import UserPermission from '../constants/UserPermission';
import ModelType from '../constants/ModelType';

window.MeetOnline = class MeetOnline {

  static _moClient = null;

  static createClient(config) {
    MeetOnline._moClient = new MOClient(config);
    return MeetOnline._moClient;
  }

  static client() {
    return MeetOnline._moClient;
  }

}
export default MeetOnline;
MeetOnline.MessageType = MessageType;
MeetOnline.EventType = EventType;
MeetOnline.UserStatus = UserStatus;
MeetOnline.UserType = UserType;
MeetOnline.UserPermission = UserPermission;
MeetOnline.ModelType = ModelType;