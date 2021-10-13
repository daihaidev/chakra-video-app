/* eslint-disable no-undef */
class ScreenManager {
  constructor() {
    this._indexPointer = 0;
    this._screenId = null;
  }

  static getInstance() {
    return !ScreenManager._INSTANCE ? (ScreenManager._INSTANCE = new ScreenManager()) : ScreenManager._INSTANCE;
  }

  setScreenId(scrId) {
    scrId ? (this._screenId = scrId) : (this._screenId = 'results');
  }

  incrementIndexPointer() {
    this._indexPointer += 1;
  }

  get indexPointer() {
    return this._indexPointer;
  }

  writeMsgToScreen(message, textColor, senderType, isFinalTranscript, skipSender) {
    let userName = '';

    senderType === 'agent'
      ? (userName = MeetOnline.getInstance().agentName)
      : (userName = MeetOnline.getInstance().userName);

    let chatScreen = document.getElementById(this._screenId);

    if (!chatScreen || !message) {
      return;
    }

    let newElementObj = null;
    const newElementId = senderType + '_p_msg_' + this.indexPointer;

    if (document.getElementById(newElementId)) {
      newElementObj = document.getElementById(newElementId);
      newElementObj.style.wordWrap = 'break-word';
      newElementObj.style.color = textColor;
      newElementObj.style.lineHeight = 'normal';

      if (senderType === 'agent') {
        newElementObj.innerHTML += `<BR/> ${message}`;
      } else {
        if (skipSender) {
          newElementObj.innerHTML = message;
        } else {
          newElementObj.innerHTML = `<strong>@${userName}:</strong> ${message}`;
        }
      }
    } else {
      newElementObj = document.createElement('p');
      newElementObj.id = newElementId;
      newElementObj.style.wordWrap = 'break-word';
      newElementObj.style.color = textColor;
      newElementObj.style.lineHeight = 'normal';

      if (skipSender) {
        newElementObj.innerHTML = message;
      } else {
        newElementObj.innerHTML = `<strong>@${userName}:</strong> ${message}`;
      }
      chatScreen.appendChild(newElementObj);
    }

    chatScreen.scrollTop = chatScreen.scrollHeight;

    if (isFinalTranscript) {
      this.incrementIndexPointer();
    }
  }

  scrollToTop() {
    let chatScreen = document.getElementById(this._screenId);
    if (chatScreen) {
      chatScreen.scrollTop = chatScreen.scrollHeight;
    }
  }

  scrollToBottom() {
    let chatScreen = document.getElementById(this._screenId);
    if (chatScreen) {
      chatScreen.scrollTop = 0;
    }
  }

  //Write Error Message
  writeToScreen(message) {
    let chatScreen = document.getElementById(this._screenId);
    if (!chatScreen) {
      return;
    }
    const pre = document.createElement('p');
    pre.style.wordWrap = 'break-word';
    pre.innerHTML = message;
    chatScreen.appendChild(pre);
  }

  writeImageToScreen(imageURL) {
    let chatScreen = document.getElementById(this._screenId);
    if (!chatScreen) {
      return;
    }
    const imgObj = document.createElement('img');

    imgObj.style.width = '100%';
    imgObj.style.height = '75%';
    imgObj.src = imageURL;
    chatScreen.appendChild(imgObj);
    chatScreen.scrollTop = chatScreen.scrollHeight;
  }
}

ScreenManager._INSTANCE = null;

export default ScreenManager;
