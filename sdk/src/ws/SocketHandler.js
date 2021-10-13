import MessageType from '../constants/MessageType';
import MeetOnline from '../mo/MeetOnline';
import EventType from '../constants/EventType';
import UserStatus from '../constants/UserStatus';

export const handle = (resp) => {
    let { messageType } = resp;

    switch(messageType) {
        case MessageType.connect:             handleConnect(resp);              break; 
        case MessageType.heartBeat:           handleHeartBeat(resp);            break; 
        case MessageType.modelUpdate:         handleModelUpdate(resp);          break; 
        default:                              handleHeartBeat(resp);
      }
}
const handleConnect = (resp) => {
    console.log('SDK::::WebSocket Connected Successfully!!- resp - ', resp);
    MeetOnline.client().status = UserStatus.CONNECTED;
    MeetOnline.client().connectMedia(resp.data.agoraOptions);
    MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onOpen', resp);
}

const handleHeartBeat = (resp) => {
    console.log('SDK:::::WebSocket HeartBeat - ',resp);
    //MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onMessage', resp);
}

const handleModelUpdate = (resp) => {
    console.log('SDK::::WebSocket modelUpdate - ',resp);
    MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onMessage', resp);
}


