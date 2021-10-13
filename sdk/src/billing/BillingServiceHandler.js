/* eslint-disable no-undef */
import Config from '../config/Config';
import MessageType from '../constants/MessageType'
import MOClient from '../mo/MOClient';
import axios from 'axios';

class BillingServiceHandler {
  static _INSTANCE = null;

  constructor() {
    this._timerDuration = Config.BILLING_TIMER_DURATION;
    this._timerId = null;
    this._curAggregate = 0;
    this.startSendingBillingEventAggregates();
  }

  static getInstance() {
    if (!BillingServiceHandler._INSTANCE) {
      BillingServiceHandler._INSTANCE = new BillingServiceHandler();
    }
    return BillingServiceHandler._INSTANCE;
  }

  canSendBillingEvent(user, mediaType, publishType) {
    const remoteTrackStats = MeetOnline.client().rtc.getRemoteTrackStats(user.uid);
    let width = remoteTrackStats.video?.receiveResolutionWidth ?? 0;
    let height = remoteTrackStats.video?.receiveResolutionHeight ?? 0;
    let canSend = true;

    if (mediaType === "audio") {
      // We dont want to send billing events for audio.
      canSend = false;
    } else if (mediaType === "video" && publishType === "publish") {
      if (width == 0 && height == 0) {
        canSend = false;
      }
    }

    return canSend;
  }
  
  async getEventJson(user, mediaType, publishType, delay, eventType) {
    // Send a billing event for published user.
    // Determine the width and height for the remote track.
    
    let maxWait = 2000; // in ms.
    let totalWaitDone = 0;
    let waitDuration = 100; // in ms

    // Wait until we exhaust the wait time limit trying to get remote stats.
    let canSend = false;
    while (true) {
      // Check if we exhausted the wait time limit.
      if (totalWaitDone >= maxWait) {
        // We did exhaust the wait time limit. So break out the loop.
        console.log("Exhausted waiting time limit.");
        break;
      }

      // Check if we can send the billing event.
      canSend = this.canSendBillingEvent(user, mediaType, publishType);
      if (canSend) {
        // We can send the billing event. So get out of the loop.
        break;
      } else {
        // We cannot send yet. So wait for the specified duration and then try again.
        const delay = millis => new Promise((resolve, reject) => {
          setTimeout(_ => resolve(), millis)
        });
        await delay(waitDuration);

        // Update the duration
        totalWaitDone = totalWaitDone + waitDuration;
      }
    }

    // Now, either we timed out with no remote stats to access OR
    // we can get the remote stats
    if (canSend) {
      // We can get the remote stats
      console.log("Can send billing event");
      const remoteTrackStats = MeetOnline.client().rtc.getRemoteTrackStats(user.uid);
      let width = remoteTrackStats.video?.receiveResolutionWidth ?? 0;
      let height = remoteTrackStats.video?.receiveResolutionHeight ?? 0;

      let resType = "";
      let pubUserId = user.uid;

      if (user.uid.startsWith('ss')) {
        // This is a screen share user.
        // So a user has started screen share.
        resType = "SCREEN_SHARE";
        pubUserId = user.uid.substr(2,user.uid.length-2);
      } else {
        // This is a normal user.
        // So a user has performed CAM/MIC action.
        if (mediaType === "video") {
          resType = "CAM";
        } else if (mediaType === "audio") {
          resType = "MIC";
        } 
      }
  
      let resStatus = "";
      if (publishType === "publish") {
        resStatus = "ON";
      } else if (publishType === "unpublish") {
        resStatus = "OFF";
      }
  
      // Create the billing event object.
      let obj = { "eventType" : eventType, 
      "roomId" : MeetOnline.client().room.id,
      "roomSessionId" : MeetOnline.client().room.roomSessionId, 
      "pubUserId" : pubUserId , "subUserId" : MeetOnline.client().user.id, 
      "width" : width, "height" : height, 
      "resourceType" : resType,
      "resourceStatus" : resStatus,
      "delayInMs" : delay};

      console.log("Created billing event : " + JSON.stringify(obj));
      return obj;
    } else {
      // We timed out.
      console.warn("Timed out while trying to get remote stats for user = " + user.uid + " | mediaType = " + mediaType + " | publishType = " + publishType);
      return null;
    }
  }

  // Method to get and send billing events to server.
  async sendBillingEvent(user, mediaType, publishType, delay) {
    // Create the request from the data.
    let billingEventRequest = await this.getEventJson(user, mediaType, publishType, delay, "BillingEvent");

    // Send the request to the server.
    if (billingEventRequest != null) {
      this.sendBillingEventToServer(billingEventRequest);
    } else {
      console.warn("Not sending billing event because the request is null for user - " + user.uid + " | mediaType = " + mediaType + " | publishType = " + publishType);
    }
  }

  // This is the actual method that sends event to server via HTTP request.
  async sendBillingEventToServer(billingEventRequest) {

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + Config.APP_KEY
    };

    console.log('BillingEvent:  URL =', Config.BILLING_SERVICE, billingEventRequest);

    try {
      const response = await axios.post(Config.BILLING_SERVICE, billingEventRequest, {headers});
      let jResponse = response.data;
      console.log("BillingEvent RESPONSE = ",jResponse);
      return jResponse;

    } catch (error) {
      console.log('Network Error while performing billing event request => ', error);
      return {status: 'FAIL', error: error.message, reason: error.response.data.message};
    } 
  }

  startSendingBillingEventAggregates() {
    // multiply by 1000 to convert to ms
    this._timerId = setInterval(this.calculateAggregates, this._timerDuration * 1000); 
  }

  stopSendingBillingEventAggregates() {
    clearInterval(this._timerId);
    this._timerId = null;
  }

  // This method gets the resolution of all remote videos and aggregates them.
  // Checks against current aggregate value.
  // If different, updates current and sends a billing aggregate event to server.
  calculateAggregates = () => {
    console.log("In calcuateAggregates. Remote users count = " + MeetOnline.client().rtc.getRemoteUsersList().length);
    let newAggregate = 0;
    MeetOnline.client().rtc.getRemoteUsersList().forEach(async uid => {
      // Determine resolution of remote user with id "uid"
      const remoteTrackStats = MeetOnline.client().rtc.getRemoteTrackStats(uid);

      // If video is not valid, then return value 0
      let width = remoteTrackStats.video?.receiveResolutionWidth ?? 0;
      let height = remoteTrackStats.video?.receiveResolutionHeight ?? 0;
      let totalRes = width * height;

      // Add the resolution to aggregate.
      newAggregate = newAggregate + totalRes;
    });

    // We have completed adding resolutions for all remote users.
    // Check if it has changed from existing.
    if (this._curAggregate != newAggregate) {
      // The aggregate has changed.
      // So send the new aggregate to server.
      let aggregateJson = this.getEventAggregateJson(newAggregate, "BillingEventAggregate");
      this.sendBillingEventAggregateToServer(aggregateJson);

      // Update our current aggregate.
      this._curAggregate = newAggregate;
    } else {
      console.log("BillingEventAggregates - not changed. value = " + newAggregate);
    }
  }

  getEventAggregateJson(aggregateVal, eventType) {
    // Send a billing aggregate event.

    // Create the billing event object.
    let obj = { "eventType" : eventType, 
    "userId" : MeetOnline.client().user.id,
    "roomId" : MeetOnline.client().room.id,
    "roomSessionId" : MeetOnline.client().room.roomSessionId, 
    "aggregateResolution" : aggregateVal};
    return obj;
  }

    // This is the actual method that sends event to server via HTTP request.
    async sendBillingEventAggregateToServer(aggregateJson) {

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Config.APP_KEY
      };
  
      console.log('BillingAggregateEvent:  URL =', Config.BILLING_SERVICE, aggregateJson);
  
      try {
        const response = await axios.post(Config.BILLING_SERVICE, aggregateJson, {headers});
        let jResponse = response.data;
        console.log("BillingAggregateEvent RESPONSE = ",jResponse);
        return jResponse;
  
      } catch (error) {
        console.log('Network Error while performing billing aggregate event request => ', error);
        return {status: 'FAIL', error: error.message, reason: error.response.data.message};
      } 
    }
}  
export default BillingServiceHandler;
