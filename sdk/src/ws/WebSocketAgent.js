import Config from '../config/Config';
import MessageType from '../constants/MessageType';
import MeetOnline from '../mo/MeetOnline';
import EventType from '../constants/EventType';
import UserStatus from '../constants/UserStatus';
import ModelType from '../constants/ModelType';
import * as SocketHandler from './SocketHandler';

class WebSocketAgent {
  constructor(sessionId, gatewayAddress) {
    if (!sessionId) throw 'Invalid SessionId';

    this._sessionId = sessionId;
    this._gatewayAddress = gatewayAddress;

    this._websocket = null;
    this._pingTimerId = null;
    this._pingTimeout = null; // Used to check if we have not received ping from server for long enough time.

    WebSocketAgent._INSTANCE = this;
  }

  static getInstance() {
    return WebSocketAgent._INSTANCE;
  }

  static build(sessionId, gatewayAddress) {
    return new WebSocketAgent(sessionId, gatewayAddress);
  }

  isWebSocketSupportedInBrowser() {
    return 'WebSocket' in window;
  }

  checkWSTimeout() {
    clearTimeout(this._pingTimeout);
    console.log("In checkWSTimeout");

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this._pingTimeout = setTimeout(() => {
      console.warn("HIT WEBSOCKET PING TIMEOUT");
      this.disconnect();
    }, 20000 + 1000);
  }

  connect() {
    if (this.isWebSocketSupportedInBrowser() === false) {
      console.log('Sorry! Your web browser does not support WebSocket');
      return;
    }

    console.log("WS # Connect # sessionId = "+this._sessionId +  ", gateway = "+this._gatewayAddress);

    let jsonReq = {
      messageType: MessageType.connect,
      userSessionId: this._sessionId,
    };

    //  ws://##GATEWAY_ADDRESS##/client_handshake
    const socketEndPoint = Config.WEBSOCKET_URL.replace("##GATEWAY_ADDRESS##", this._gatewayAddress);
    let socketURL = socketEndPoint + '?jsonRequest=' + encodeURI(JSON.stringify(jsonReq));

    console.log("socketURL = "+socketURL);
    this._websocket = new WebSocket(socketURL); //CONNECT WITH TG
    console.log("this._websocket = ", this._websocket);

    //Handle WebSocket Events
    this._websocket.onopen = e => this.onOpen(e);
    this._websocket.onmessage = e => this.onMessage(e);
    this._websocket.onerror = e => this.onError(e);
    this._websocket.onclose = e => this.onClose(e);


  }

  onOpen() {
    console.log('You have have successfully connected to the server');
    this._pingTimerId = setInterval(this.pingServer, 3000); // Send ping every 3 seconds.
    this.checkWSTimeout();
  }

  onMessage(event) {
    console.log('WS Message Received: ',event.data);
    var data = JSON.parse(event.data);
    if (data.messageType === "heartBeat") {
      // Its a heartbeat message.
      this.checkWSTimeout();
    }

    if (MeetOnline.client().status === UserStatus.DISCONNECTING || MeetOnline.client().status === UserStatus.DISCONNECTED) {
      console.log('onMessage => CALL TERMINATED');
      return;
    }
    let resp = JSON.parse(event.data);
    SocketHandler.handle(resp)
  }

  onError(e) {
    console.error('WebSocket Error');
    clearInterval(this._pingTimerId);
    let resp = {
      messageType: MessageType.socketError,
      sessionId: this._sessionId,
      message: "WebSocket Error",
      code: e.code,
      reason: e.reason
    };
    MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onError', resp);
  }

  onClose() {
    console.error('********* WebSocket Closed');
    clearTimeout(this._pingTimeout);
    clearInterval(this._pingTimerId);

    // Format a Response as We do not have any response from Server due to WebSocket closed
    let resp = {    
      reason: 1,
      messageType: MessageType.socketClose,
      message: "WebSocket Connection Closed",
      sessionId: this._sessionId,
    };
    
    MeetOnline.client().status = MeetOnline.DISCONNECTED;
    MeetOnline.client().disconnectMedia(); //---STOP RTC if any
    MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onClose', resp);
  }

  isWebSocketOpen() {
    return this._websocket !== null && this._websocket.readyState === this._websocket.OPEN;
  }

  disconnect() {
    console.log('In WebSocket disconnect');
    clearInterval(this._pingTimerId);
    clearTimeout(this._pingTimeout);

    if (this._websocket !== null) {
      this._websocket.onopen = null;
      this._websocket.onmessage = null;
      this._websocket.onerror = null;
      this._websocket.onclose = null;
    }

    if (this._websocket !== null && this._websocket.readyState === this._websocket.OPEN) {
      console.log('...attempting to close WebSocket');
      this._websocket.close();
      this._websocket = null;
      console.log('WebSocket Closed!!');

      MeetOnline.client().status = UserStatus.DISCONNECTED;
      MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onClose', {});
    }
  }

  pingServer = () => {
    var pingReq = {
      messageType: MessageType.heartBeat,
      userSessionId: this._sessionId,
      message: 'PING',
    };
    if (this._websocket && this._websocket.readyState === this._websocket.OPEN) {
      console.log("AKS - Sending ping message to server.");
      this._websocket.send(JSON.stringify(pingReq));
    } else {
      console.log("Failed to ping websocket ********");
    }
  }

  sendMediaConnectedToGateway() {
    let jReq = {
      messageType: MessageType.MediaConnected,
      sessionId: this._sessionId,
    };
    console.log("sendMediaConnectedToTG --- jReq = ", jReq);
    this._websocket.send(JSON.stringify(jReq));
  }

  sendMessageToMeetOnlineGateway(modelType, props, modelId) {
    var msgReq = {
      messageType: MessageType.modelUpdate,
      userSessionId: this._sessionId,
      data: {
        id: modelId,
        model: modelType,
        properties: props
      }
    };

    if (this._websocket.readyState === this._websocket.OPEN)
    {
      this._websocket.send(JSON.stringify(msgReq));
    } 
    else 
    {
      let resp = {
        sessionId: this._sessionId,
        status: 'FAIL',
        errorCode: -1003,
        errorMessage: '@<b>ERROR</b>: Connection Lost with Server, Please refresh browser. This may be caused due to you have reached your daily usage limit',
      };
      MeetOnline.client().sendEventToSDKSubscriber(EventType.WebSocket, 'onError', resp);
    }
  }

  sendUserTypingSignal(isUserTyping) {
    let jReq = {
      messageType: MessageType.UserTyping,
      sessionId: this._sessionId,
      userTyping: isUserTyping ? true : false
    };
    console.log("sendUserTypingSignal --- jReq = ", jReq);
    this._websocket.send(JSON.stringify(jReq));
  }
}
WebSocketAgent._INSTANCE = null;
export default WebSocketAgent;
