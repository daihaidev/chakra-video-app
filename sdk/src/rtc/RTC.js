/* eslint-disable no-undef */
import MeetOnline from '../mo/MeetOnline';
import EventType from '../constants/EventType';
import ModelType from '../constants/ModelType';
import WebSocketAgent from '../ws/WebSocketAgent';
import BillingServiceHandler from '../billing/BillingServiceHandler';

class RTC {
  constructor(_options) {

    this.localTracks = {
      videoTrack: null,
      audioTrack: null
    };

    this.localTrackState = {
      videoTrackEnabled: true,
      audioTrackEnabled: true,
    };

    this.remoteUsers = {};

    // Agora client options
    this.options = _options;

    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    //ScreenShare
    this.screenShareClient = null;
    this.screenShareEnabled = false;
    this.screenTrack = null;

    // RTM
    this.rtmClient;
    this.rtmChannelName;
    this.rtmChannel;

    // VAD
    this.MaxAudioSamples = 400;
    this.MaxBackgroundNoiseLevel = 30;
    this.SilenceOffeset = 10;
    this.audioSamplesArr = [];
    this.audioSamplesArrSorted = [];
    this.exceedCount = 0;
    this.exceedCountThreshold = 2;
    this.vadUid;
    this.vadSend = 0;
    this.vadSendWait = 2 * 1000;
    this.vadRecv = 0;
    this.vadRecvWait = 3 * 1000;

    this.myUid = [];
    this.myPublishClient = -1;

    // String Constants
    this.VAD = "VAD";
    this._activeSpeakerUid = null;
  }

  setActiveSpeakerUid(_speakerUid) {
    this._activeSpeakerUid = _speakerUid;
  }

  getRemoteUsersList() {
    return Object.keys(this.remoteUsers);
  }

  getRemoteTrackStats(uid) {
    const remoteTrackStats = { video: this.client.getRemoteVideoStats()[uid], audio: this.client.getRemoteAudioStats()[uid] };
    return remoteTrackStats;
  }

  getTracks(uid) {

    if (uid.startsWith('ss') && uid === this.options.ssUid) {
      return { videoTrack: this.screenTrack, audioTrack: null };
    }

    if (uid === this.options.uid) {
      //We dont want to loop back Audio Track for local user
      return { videoTrack: this.localTracks?.videoTrack, audioTrack: null };
    }

    const userX = this.remoteUsers[uid];
    return { videoTrack: userX?.videoTrack, audioTrack: userX?.audioTrack };
  }

  async join() {
    console.log("RTC Join()");
    this.client.on("user-published", this.handleUserPublished);
    this.client.on("user-unpublished", this.handleUserUnpublished);
    this.client.on("user-joined", this.handleUserJoined);
    this.client.on("user-left", this.handleUserLeft);

    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [this.options.uid, [this.localTracks.audioTrack, this.localTracks.videoTrack]] = await Promise.all([
      // join the channel
      this.client.join(this.options.appid, this.options.channel, this.options.rtcToken || null, this.options.uid || null),
      // create local tracks, using microphone and camera -simultaneously
      AgoraRTC.createMicrophoneAndCameraTracks()
    ]);

    // play local video track
    //this.localTracks.videoTrack.play("activeSpeakerVideo");
    console.log("RTC Join() - this.options.uid = " + this.options.uid);
    MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onConnected', { uid: this.options.uid, type: 'local' });


    //set the low stream
    this.client.setLowStreamParameter({
      width: 320,
      height: 180,
      framerate: 15,
      bitrate: 200,
    });

    // Enable dual-stream mode.
    try {
      await this.client.enableDualStream();
    }
    catch (error) {
      console.log("dual stream mode", error)
    }

    // publish local tracks to channel
    await this.client.publish(Object.values(this.localTracks));
    console.log("publish success");

    this.initVAD();
  }

  initVAD() {
    this.initRTM();
    setInterval(() => {
      this.voiceActivityDetection();
    }, 150);
  }

  async leave() {
    console.log("this --> ", this);
    for (let trackName in this.localTracks) {
      let track = this.localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        this.localTracks[trackName] = undefined;
      }
    }
    // remove remote users and player views
    this.remoteUsers = {};

    // leave the channel
    await this.client.leave();
    console.log("client leaves channel success");
  }

  async subscribe(user, mediaType) {
    const uid = user.uid;
    await this.client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      //MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onConnected', {uid: uid, type: 'remote'});
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  handleUserJoined = (user) => {
    console.log("handleUserJoined - user = ", user);
    this.remoteUsers[user.uid] = user;

    console.log("handleUserJoined - this = ", this.remoteUsers);
  }

  handleUserLeft(user) {
    console.log("handleUserLeft - user = ", user);
    if (user.uid.startsWith('ss')) {
      this.screenShareEnabled = false;
      MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onScreenShareStopped', { uid: user.uid, type: 'remote' });
    }
    delete this.remoteUsers[user.uid];
    MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onDisconnected', { uid: user.uid });
  }

  async handleUserPublished(user, mediaType) {
    console.log("^^^^^^^^handleUserPublished - user - ", user, mediaType);

    // Do not subscribe in following two cases:
    // 1. If the published user is same as local one.
    // 2. screenshare for the user who is sharing it.

    // Check (1)
    let isSameUserId = (user.uid === MeetOnline.client().rtc.options.uid);

    // Check (2)
    // Check if this event is for screenshare AND
    // Check if the user doing screenshare is local one.
    let isSameUserIdSharing = (user.uid.startsWith('ss') && (user.uid.substring(2) === MeetOnline.client().rtc.options.uid));

    if (isSameUserId || isSameUserIdSharing) {
      // Do nothing as we dont want to subscribe in this case.
      console.log("Not subscribing because the publishing user is the local one.");
    } else {
      await MeetOnline.client().rtc.subscribe(user, mediaType);
      MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onPublished', { uid: user.uid, type: 'remote', hasAudio: user.hasAudio, hasVideo: user.hasVideo });
      if (user.uid.startsWith('ss')) {
        //MeetOnline.client().rtc.screenShareEnabled = true;
        MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onScreenShareStarted', { uid: user.uid, type: 'remote' });
      }

      // Send the billing event to the server.
      BillingServiceHandler.getInstance().sendBillingEvent(user, mediaType, "publish", 0);
    }
  }

  async handleUserUnpublished(user, mediaType) {
    console.log("handleUserUnpublished - user = ", user);
    if (user.uid.startsWith('ss')) {
      //MeetOnline.client().rtc.screenShareEnabled = false;
      MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onScreenShareStopped', { uid: user.uid, type: 'remote' });
    }

    // Send the billing event to the server.
    // Do not unsubscribe in following two cases because we did not subscribed for those cases in handleUserPublished method:
    // 1. If the published user is same as local one.
    // 2. screenshare for the user who is sharing it.

    // Check (1)
    let isSameUserId = (user.uid === MeetOnline.client().rtc.options.uid);

    // Check (2)
    // Check if this event is for screenshare AND
    // Check if the user doing screenshare is local one.
    let isSameUserIdSharing = (user.uid.startsWith('ss') && (user.uid.substring(2) === MeetOnline.client().rtc.options.uid));

    if (isSameUserId || isSameUserIdSharing) {
      // Do nothing as we dont want to subscribe in this case.
      console.log("Not unsubscribing because the unpublishing user is the local one.");
    } else {
      BillingServiceHandler.getInstance().sendBillingEvent(user, mediaType, "unpublish", 0);
    }

    delete this.remoteUsers[user.uid];
  }

  toggleMic() {
    if (this.localTrackState.audioTrackEnabled) {
      this.muteAudio();
    } else {
      this.unmuteAudio();
    }
  }

  toggleCam() {
    if (this.localTrackState.videoTrackEnabled) {
      this.muteVideo();
    } else {
      this.unmuteVideo();
    }
  }

  toggleScreenShare(screenShareEnabled) {
    console.log("Inside toggleScreenShare ----> screenShareEnabled = ", screenShareEnabled);
    if (screenShareEnabled === true) {
      try {
        this.startScreenShare();
      }
      catch (err) {
        console.log("ERROR WHILE START SCREEN-SHARE");
        console.log(err);
        this.stopScreenShare();
      }
      return;
    }
    this.stopScreenShare();
  }

  requestScreenShare() {
    console.log("Inside requestScreenShare ----> screenShareEnabled = ", this.screenShareEnabled);
    WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.user, { screenShareEnabled: !this.screenShareEnabled });
  }

  async startScreenShare() {
    console.log("startScreenShare --- this.options = ", this.options);

    this.screenShareClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    console.log("startScreenShare --- Client Created");

    await this.screenShareClient.join(this.options.appid, this.options.channel, this.options.ssToken || null, this.options.ssUid || null),
      console.log("startScreenShare --- Channel Joined");

    AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" })
      .then(localScreenTrack => this.screenTrackCreated(localScreenTrack))
      .catch(err => this.screenTrackCancelled(err));
  }

  async screenTrackCreated(localScreenTrack) {
    console.log("startScreenShare --- screenTrackCreated - localScreenTrack = ", localScreenTrack);
    this.screenTrack = localScreenTrack;
    this.screenTrack.on("track-ended", (event) => {
      console.log("TRACK-ENDED - EVENT - ", event);
      this.stopScreenShare();
    });
    await this.screenShareClient.publish(this.screenTrack);
    console.log("startScreenShare --- screenTrack Published");

    this.screenShareEnabled = true;
    console.log("startScreenShare --- Sending onScreenShareStarted Event");
    MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onScreenShareStarted', { uid: this.options.ssUid, type: 'local' });
    //WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.user, {screenShareEnabled: true});
  }

  screenTrackCancelled(err) {
    console.log("screenTrackCancelled - ERROR - ", err);
    this.stopScreenShare();
  }

  async stopScreenShare() {
    this.screenTrack?.close();
    await this.screenShareClient.leave();
    this.screenTrack = null;
    this.screenShareClient = null;
    this.screenShareEnabled = false;
    MeetOnline.client().sendEventToSDKSubscriber(EventType.Media, 'onScreenShareStopped', { uid: this.options.ssUid, type: 'local' });
    //WebSocketAgent.getInstance().sendMessageToMeetOnlineGateway(ModelType.user, {screenShareEnabled: false});
  }

  // Mute Mic
  async muteAudio() {
    if (!this.localTracks.audioTrack) return;
    await this.localTracks.audioTrack.setEnabled(false);
    this.localTrackState.audioTrackEnabled = false;
  }
  //Unmute Mic
  async unmuteAudio() {
    if (!this.localTracks.audioTrack) return;
    await this.localTracks.audioTrack.setEnabled(true);
    this.localTrackState.audioTrackEnabled = true;
  }

  // Mute Cam
  async muteVideo() {
    if (!this.localTracks.videoTrack) return;
    await this.localTracks.videoTrack.setEnabled(false);
    this.localTrackState.videoTrackEnabled = false;
  }
  async unmuteVideo() {
    if (!this.localTracks.videoTrack) return;
    await this.localTracks.videoTrack.setEnabled(true);
    this.localTrackState.videoTrackEnabled = true;
  }

  initRTM() {
    this.rtmClient = AgoraRTM.createInstance(this.options.appid, { logFilter: AgoraRTM.LOG_FILTER_ERROR });
    this.rtmClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('this.rtmClient connection state changed to ' + newState + ' reason: ' + reason);
    });

    this.rtmChannelName = this.options.channel;
    const rtmCreds = {
      token: this.options.rtmToken,
      uid: this.options.uid
    }
    console.log("RTM LOGIN - rtmCreds - ", rtmCreds);
    this.rtmClient.login(rtmCreds).then(() => {
      this.rtmChannel = this.rtmClient.createChannel(this.rtmChannelName);
      this.rtmChannel.join().then(() => {
        this.rtmChannel.on('ChannelMessage', (msg, senderId) => {
          console.log("msg - ", msg);
          this.handleRTM(senderId, msg.text);
        });
      }).catch(error => {
        console.log('AgoraRTM client join failure', error);
      });
    }).catch(error => {
      console.log('AgoraRTM client login failure', error);
    });
  }

  handleRTM(senderId, text) {
    if (text.startsWith(this.VAD) && (Date.now() - this.vadRecv) > this.vadRecvWait) {
      this.vadRecv = Date.now();

      this.vadUid = text.split(":")[1];
      console.log("VAD" + senderId + " vadUid= " + this.vadUid);
      if (this._activeSpeakerUid !== this.vadUid) {
        MeetOnline.client().sendActiveSpeaker(this.vadUid);
      }
    }
  }

  getInputLevel(track) {
    let analyser = track._source.analyserNode;
    const bufferLength = analyser.frequencyBinCount;
    let data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);
    let values = 0;
    let average;
    let length = data.length;
    for (let i = 0; i < length; i++) {
      values += data[i];
    }
    average = Math.floor(values / length);
    return average;
  }

  voiceActivityDetection() {
    if (!this.localTracks.audioTrack || !this.rtmChannel) {
      return;
    }
    let audioLevel = this.getInputLevel(this.localTracks.audioTrack);
    if (audioLevel <= this.MaxBackgroundNoiseLevel) {
      if (this.audioSamplesArr.length >= this.MaxAudioSamples) {
        let removed = this.audioSamplesArr.shift();
        let removedIndex = this.audioSamplesArrSorted.indexOf(removed);
        if (removedIndex > -1) {
          this.audioSamplesArrSorted.splice(removedIndex, 1);
        }
      }
      this.audioSamplesArr.push(audioLevel);
      this.audioSamplesArrSorted.push(audioLevel);
      this.audioSamplesArrSorted.sort((a, b) => a - b);
    }
    let background = Math.floor(3 * this.audioSamplesArrSorted[Math.floor(this.audioSamplesArrSorted.length / 2)] / 2);
    if (audioLevel > background + this.SilenceOffeset) {
      this.exceedCount++;
    } else {
      this.exceedCount = 0;
    }

    if (this.exceedCount > this.exceedCountThreshold) {
      this.exceedCount = 0;
      if ((Date.now() - this.vadSend) > this.vadSendWait) {
        this.vadSend = Date.now();
        this.rtmChannel.sendMessage({ text: this.VAD + ':' + this.options.uid }).then(() => {
          if (this._activeSpeakerUid !== this.vadUid) {
            MeetOnline.client().sendActiveSpeaker(this.options.uid);
          }
        }).catch(error => {
          console.log('AgoraRTM VAD send failure');
        });
      }
    }
  }
}
export default RTC;
