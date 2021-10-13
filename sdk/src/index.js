import MeetOnline from './mo/MeetOnline';
import queryString from 'query-string';
import EventType from './constants/EventType';
import UserType from './constants/UserType';
import * as MOTemplate from './view/MOTemplate';
import MessageType from './constants/MessageType';

let _moClient;
console.log("process.env.PUBLIC_URL => "+process.env.PUBLIC_URL);
console.log("process.env.NODE_ENV => "+process.env.NODE_ENV);
console.log("process.env.TARGET_ENV => "+process.env.TARGET_ENV);

const urlParamsString = window.location.search + window.location.hash;
let query = queryString.parse(urlParamsString, {parseBooleans: true, parseNumbers: false});
if (!query.roomHash) {
  query.roomHash = window.location.pathname.replace("/", '').trim();
}
console.log(query);
  

const rootElement = document.getElementById('rootElement');
if (rootElement) {
  _moClient = null;

  const w1 = response => {
    handleConnect(response);
  };

  const w2 = response => {
    let { messageType } = response;

    switch(messageType) {
        case MessageType.connect:             handleConnect(response);              break; 
        case MessageType.modelUpdate:         handleModelUpdate(response);          break; 
        default:                              handleModelUpdate(response);
      }
  };

  const w3 = response => {
    console.log('CB----w3----',response);
  };

  const w4 = response => {
    console.log('CB----w4----',response);
  };

  const a1 = response => {
    console.log('CB----a1----',response);
  };

  const a2 = response => {
    console.log('CB----a2----',response);
  };

  const m1 = response => {
    console.log('CB----m1----',response);
  };

  const m2 = response => {
    console.log('CB----m2----',response);
  };

  let authEventsCB = {
    onSuccess: a1,
    onFail: a2
  };

  let wsEventsCB = {
    onOpen: w1,
    onMessage: w2,
    onError: w3,
    onClose: w4
  };

  let mediaEventsCB = {
    onConnected: m1,
    onFail: m2
  };



  _moClient = MeetOnline.createClient({
      userName: query.userName,
      roomHash: query.roomHash,
      rootElement: rootElement
  });

  _moClient.on(EventType.Auth, authEventsCB);
  _moClient.on(EventType.WebSocket, wsEventsCB);
  _moClient.on(EventType.Media, mediaEventsCB);

  MOTemplate.render(rootElement, _moClient);
  _moClient.connectGateway();
}


const addUserToUI = (user) => {
  console.log("addUserToUI - user = ",user);
	const div = document.querySelector('#participants');
	 div.innerHTML += `<a class="list-group-item list-group-item-action" id="user-${user.id}" href="!#" onClick="return false;">
	      	<img class="user-pic" src="${user.photo}"/> 
	      	<span class="selectUser">
	      		${user.name}<span class="mx-2">|</span>${user.id}
	      	</span> 
	      </a>`;
}

const removeUserFromUI = (userId) => {
  $("#user-"+userId).remove(); //Update UI
}

const addChatBubble = (userId, userName, senderType, message) => {
	
	if (!message) return;
	
	const userChatPane = document.querySelector("#chatScreen");
	
	if (senderType === UserType.AUDIENCE) 
		userChatPane.innerHTML += `<div id="${userId}" class="bubbleContainerUser"><div class="bubble user">@${userName}: ${message}</div></div>`;

	if (senderType === UserType.BROADCASTER) 
		userChatPane.innerHTML += `<div id="${userId}" class="bubbleContainerAvatar"><div class="bubble avatar">@${userName}: ${message}</div></div>`;
	
	if (senderType === UserType.MODERATOR) 
		userChatPane.innerHTML += `<div id="${userId}" class="bubbleContainerOperator"><div class="bubble operator">@${userName}: ${message}</div></div>`;
	
	scrollToTop('chatScreen');
}


const scrollToTop = (screenId) =>{
  let chatScreen = document.getElementById(screenId);
  if (chatScreen) {
    chatScreen.scrollTop = chatScreen.scrollHeight;
  }
}

const handleConnect = (resp) => {
  console.log('WebSocket INDEX.JS handleConnect - response = ',resp);
  addUserToUI(_moClient.user); //Add self
  resp.data.users.forEach(p => addUserToUI(p)); // Add other Users in the room
}

const handleModelUpdate = (resp) => {
  console.log('WebSocket INDEX.JS handleModelUpdate - response = ',resp);
  if (resp.status != 'OK'){
    console.error("ERROR");
    return;
  }

  if (resp.roomSessionId !== _moClient.room.roomSessionId) {
    console.error("Invalid Room State");
    console.error("Invalid Room State");
    return;
  }

  if (resp.data.model === 'user') {
    const props = resp.data.properties;
    if (Object.keys(props).length === 0) {
      removeUserFromUI(resp.data.id);
      return;
    }
    addUserToUI(resp.data.properties);
  }

  if (resp.data.model === 'room') {
    
  }

  if (resp.data.model === 'chat') {
    let msg = resp.data.properties.chatMessage;
    let author = resp.data.properties.author;
    addChatBubble(author.id, author.name, author.type, msg);
  }

}



