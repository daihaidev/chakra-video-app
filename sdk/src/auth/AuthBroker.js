import Config from '../config/Config';
import axios from 'axios';
import MessageType from '../constants/MessageType';
import Util from '../util/Util';

class AuthBroker {

  static _INSTANCE = null;

  constructor() {
    this._retryCount = 0;
    this._retryTask = null;
  }

  static getInstance() {
    if (!AuthBroker._INSTANCE) {
      AuthBroker._INSTANCE = new AuthBroker();
    }
    return AuthBroker._INSTANCE;
  }


  async login(roomHash, userName) {

    let history = Util.readCookie(roomHash);

    let authRequest = {
      messageType: MessageType.auth,
      customerPrefix: Util.parseCustomerIdFromURI(),
      roomHash,
      userName,
      userId: history ? history.userId : null,
      deviceOS: Util.detectDeviceOS()
    };

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + Config.APP_KEY
    };

    console.log('AUTH:  URL =', Config.AUTH_URL, authRequest);

    try {
      const response = await axios.post(Config.AUTH_URL, authRequest, {headers});
      this.clearRetry();
      let jResponse = response.data;
      console.log(jResponse);
      console.log('Authentication successful...sessionId = ' + jResponse.sessionId);
      Util.storeCookie(roomHash, jResponse.user);
      return jResponse;

    } catch (error) {
      //this.retryAuth(roomHash, userName);
      console.log('Network Error while login => ', error);
      return {status: 'FAIL', error: error.message, reason: error.response?.data.message};
    } 
  }

  retryAuth(roomHash, userName) {
      this._retryTask = setTimeout(function () {
        AuthBroker.getInstance()._retryCount++;
        AuthBroker.getInstance().login(roomHash, userName);
    }, 5000);
  }

  clearRetry() {
    if (this._retryTask) {
      clearTimeout(this._retryTask);
      this._retryTask = null;
      this._retryCount = 0;
    }
  }

  async getRoomBranding(roomHash) {
    let roomBrandingRequest = {
      messageType: MessageType.roomBranding,
      customerPrefix: Util.parseCustomerIdFromURI(),
      roomHash,
      deviceOS: Util.detectDeviceOS()
    };

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + Config.APP_KEY
    };

    console.log('RoomBranding:  URL =', Config.ROOM_BRANDING, roomBrandingRequest);

    try {
      const response = await axios.post(Config.ROOM_BRANDING, roomBrandingRequest, {headers});
      let jResponse = response.data;
      console.log("RoomBranding RESPONSE = ",jResponse);
      return jResponse;

    } catch (error) {
      console.log('Network Error while getting Room Branding => ', error);
      return {status: 'FAIL', error: error.message, reason: error.response?.data.message};
    } 
  }

}
export default AuthBroker;
