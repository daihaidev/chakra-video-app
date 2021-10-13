import DeviceOS from '../constants/DeviceType';
import Config from '../config/Config';
import dayjs from 'dayjs';

class Util {
  
  static now = () => dayjs().format("yyyy-MM-dd HH:mm:ss");

  static get(name) {
    if ((name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(location.search)))
      return decodeURIComponent(name[1]);
  }

  static storeCookie(roomHash, user) {

    const {userId, name} = user;

    let history = {};

    var storedJSONStr = localStorage.getItem(Config.MO_COOKIE_NAME);
    if (storedJSONStr) 
    {
      history = JSON.parse(storedJSONStr);
    }
    history[roomHash] = {userName: name, userId: userId};
    localStorage.setItem(Config.MO_COOKIE_NAME, JSON.stringify(history));
  }

  static readCookie(roomHash) {
    var storedJSONStr = localStorage.getItem(Config.MO_COOKIE_NAME);
    if (storedJSONStr) {
      try{
        const history = JSON.parse(storedJSONStr);
        return history[roomHash];
      }
      catch(err) {
        console.log(err);
        localStorage.removeItem(Config.MO_COOKIE_NAME);
      }
    }
    return null;
  }

  static detectDeviceOS() {
    if (navigator.userAgent.match(/Android/i)) {
      return DeviceOS.Android;
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return DeviceOS.iOS;
    } else if (navigator.userAgent.match(/Windows Phone/i)) {
      return DeviceOS.WindowsPhone;
    } else {
      return DeviceOS.WebBrowser;
    }
  }

  static parseCustomerIdFromURI() {
    let hostname = window.location.hostname;
    return hostname.replace(".meetonline.io", "").trim();
  }

  static hasPermission(bitset, permission){
    return ( (bitset & permission) !== 0);
  }
  
}

export default Util;
