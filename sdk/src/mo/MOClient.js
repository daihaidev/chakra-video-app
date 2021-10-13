/* eslint-disable no-undef */
import AuthBroker from '../auth/AuthBroker';
import WebSocketAgent from '../ws/WebSocketAgent';
import EventType from '../constants/EventType';
import UserStatus from '../constants/UserStatus';
import User from '../entities/User';
import Room from '../entities/Room';
import UserType from '../constants/UserType';
import ModelType from '../constants/ModelType';
import RTC from '../rtc/RTC';
import Util from '../util/Util';
import BillingServiceHandler from '../billing/BillingServiceHandler';

class MOClient {
    constructor(config) {
        this._roomHash = config.roomHash;
        this._userName = config.userName;
        this._videoElements = config.videoElements;

        this._eventsCallbacks = {};
        this._status = UserStatus.DISCONNECTED;

        this._user = null;
        this._room = null;
        this._rtc = null;

        this._autoDisconnect = config.autoDisconnect === undefined ? null : config.autoDisconnect;
    }

    on(eventType, events) {
        this._eventsCallbacks[eventType] = events;
    }

    get status() {
        return this._status;
    }
    set status(newStatus) {
        this._status = newStatus;
    }

    setUserName(newName) {
        this._userName = newName;
    }

    get autoDisconnect() {
        return this._autoDisconnect;
    }

    get user() {
        return this._user;
    }

    get room() {
        return this._room;
    }

    get rtc() {
        return this._rtc;
    }

    isModerator() {
        return this._user._type === UserType.MODERATOR;
    }

    async validateAndGetRoomBranding() {
        const resp = await AuthBroker.getInstance().getRoomBranding(this._roomHash);
        return resp;
    }

    async connectGateway() {
        this._status = UserStatus.CONNECTING;
        const resp = await AuthBroker.getInstance().login(this._roomHash, this._userName);
        console.log("connectGateway ---auth resp = ",resp);

        if (resp.status === 'OK') {
            this._status = UserStatus.AUTHORIZED;
            this._user = new User(resp.user);
            this._room = new Room(resp.room);

            console.log("this._user = ",this._user );
            console.log("this._room = ",this._room );

            this.sendEventToSDKSubscriber(EventType.Auth, 'onSuccess', resp);
            WebSocketAgent.build(resp.user.sessionId, resp.room.assignedGateway).connect();
        } else {
            this.sendEventToSDKSubscriber(EventType.Auth, 'onFail', resp);
            this.tryConnectGateway(2000);
        }
    }

    tryConnectGateway(delay) {
        console.log("AKS : In tryConnectGateway. Scheduling to try to connect after " + delay + " ms");
        setTimeout(() => {
            console.log("AKS : Will now reconnect gateway");
            this.connectGateway();    
        }, delay);
    }

    disconnectGateway(reason) {

        console.log("disconnectGateway ----> reason = " + reason);
        this._status = UserStatus.DISCONNECTING;


        // END RTC CALL
        this.disconnectMedia();

        // END WEBSOCKET
        WebSocketAgent.getInstance()?.disconnect();

        // Stop sending aggregate events to billing service.
        BillingServiceHandler.getInstance().stopSendingBillingEventAggregates();
    }

    connectMedia(_agoraOptions) {
        console.log("connecting media....");
        this._rtc = new RTC(_agoraOptions);
        this._rtc.join();
    }

    getMediaTracks(uid) {
        return this._rtc.getTracks(uid);
    }

    disconnectMedia() {
        console.log("disconnect media....");
        if (this._rtc){
            this._rtc.leave();
            //this._rtc = null;
        }
    }

    sendEventToSDKSubscriber(eventType, event, jsonResponse) {
        console.log('callBackToClient - eventType = ' + eventType + ', event = ' + event );
        this._eventsCallbacks[eventType][event](jsonResponse);

        if (eventType === EventType.WebSocket && event === "onOpen") {
            console.log("AKS : Auto disconnect = " + this._autoDisconnect);
            // If we are asked to auto timeout then set timeout accordingly.
            if(this._autoDisconnect !== null && this._autoDisconnect > 0) {
                setTimeout(() => {
                    console.log("AKS : Will now disconnect gateway");
                    this.disconnectGateway("Auto disconnect");
                }, this._autoDisconnect * 1000) // Multiply by 1000 to convert to ms
            }        
        } else if (eventType === EventType.WebSocket && event === "onClose") {
            if(this._autoDisconnect !== null && this._autoDisconnect > 0) {
                this.tryConnectGateway(2000);
            } else {
                // The websocket is closed.
                // So stop agora channel too if not already.
                this.disconnectGateway();
            }
        }
    }

    sendPublicChat(text) {
        if (WebSocketAgent.getInstance()) {
          const props = {
              chatMessage: text
          };
          WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.chat, props);
        }
      }

      sendPrivateChat(text, targetUserId) {
        if (WebSocketAgent.getInstance()) {
          const props = {
              chatMessage: text,
              userId: targetUserId
          };
          WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.chat, props);
        }
      }

      sendHandRaised(newVal, userId) {
        if (WebSocketAgent.getInstance()) {
            const props = {
                handUp: newVal
            };
            WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.user, props, userId);
          }
      }

      sendActiveSpeaker(speakerId) {
        this._rtc.setActiveSpeakerUid(speakerId);

        if (WebSocketAgent.getInstance()) {
            const props = {
                activeSpeakerUid: speakerId.toString()
            };
            WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.room, props);
          }
      }

      togglePermission(userId, bitset, permission) {
        let newPermission = 0;
        if (Util.hasPermission(bitset, permission)) {
            newPermission = bitset & ~permission;
        } else {
            newPermission = bitset | permission;
        }

        if (WebSocketAgent.getInstance()) {
            const props = {
                permissions: newPermission
            };
            WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.user, props, userId);
          }
      }

      publishOverlay(overlay) {
        if (!overlay) return;
        if (WebSocketAgent.getInstance()) {
            const props = overlay;
            WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.overlay, props, overlay.id);
          }
      }

      unPublishOverlay(id) {
        if (!id) return;
        if (WebSocketAgent.getInstance()) {
            const props = {};
            WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.overlay, props, id);
        }
      }

      toggleMic(micStatus, userId) {
        WebSocketAgent.getInstance()?.sendMessageToMeetOnlineGateway(ModelType.user, {micEnabled: !micStatus}, userId);
      }
    
      toggleCam(camStatus, userId) {
        WebSocketAgent?.getInstance()?.sendMessageToMeetOnlineGateway(ModelType.user, {camEnabled: !camStatus}, userId);
      }

      toggleHeartAnimation(animationStatus) {
            const props = {
                heartAnimating: !animationStatus
            };
            WebSocketAgent?.getInstance()?.sendMessageToMeetOnlineGateway(ModelType.room, props);
      }

}
export default MOClient;
