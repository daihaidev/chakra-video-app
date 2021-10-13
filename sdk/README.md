# MO JS SDK BUILD STEPS

## 1. Get Code

`git clone https://github.com/fundingreturn/moclient.git`

## 2. Go to root dir of code

`cd moclient/sdk/`

## 3. Fetch JS dependency Libs

`npm install`

## 4. Run Dev Server  (sets [process.env.NODE_ENV = development] automatically)

While making code change keep webpack-dev-server running, as it hot deploys code and refreshes browser itself.
it launches index.html under build.

`npm start`

## 5. Do Prod Build (sets [process.env.NODE_ENV = production] automatically)

`npm run build`

## 6. Final Deliverable Library

When we run build, mo.sdk.js  file is created under build folder which is final deliverable.
build folder contains test clients index.html etc.

## 7. Application Configurations

configs are in src/config/Config.js which automatically switches configs for dev and prod based on process.env.NODE_ENV value which is set by build process. So we don't need to change any config manually.

## 8. Tools Used

We use following tools:  
**a)** npm - Node package manager - runs Script commands mentioned in package.json  
**b)** webpack - generate bundle which is final deliverable  
**c)** babel transpiler to transpile code from ES6 to ES5.  
**d)** Recommended IDE to develop is Visual Code Studio <https://code.visualstudio.com/download>

## 9. For Any initialization tasks  

put code in index.js which is considered similar to main() program and is entry point defined in the package.json

## 10. MO SDK and Input Parameters

Example Call for Using MO JS SDK:

_mo = MeetOnline.createClient({
      avatarId: '10',
      userId: '1234567890',
      langPref: 'en-US',
      userName: 'sdk-test-user',
      rootElement: rootElement,
      wsEventsCB: wsEventsCB
  });
## Room Hash

Rooms can be created on MeetOnline Portal - <https://meetonline.io>
Three URLS are generated when a Room is Created on the Portal
--Audience URL - for example -  https://meetonline.io/uyu-sagh-oiu
--Broadcastor URL - for example -  https://meetonline.io/xyu-zbgp-ytt
--Moderator URL - for example -  https://meetonline.io/xss-lmii-poo

When URL is hit - Flow is like
React---->SDK ---> MOLB ----> MOG
MOLB talks with DB and loads room info from DB
MOG maintains WebSocket connection with SDK.

## Session Id

Every User who joins a Room - gets assigned a sessionId which uniquley defines User Session.

One Room can be associated with One Meeting at a time but in future there can be many meetings in the same room.
Every such meeting session is assigned a meeting Id.

User Id - Its the Id to share with Other Users, as we cant share sessionId with other Users.

## Language Pref

Users Language Preference is set initially at the time Auth is performed.

## User name

React App asks UserName and pass it to SDK AUTH.

## MOG

After initial SDK AUth is successful, each user is assigned as session Id and MOG Server.
There can be multiple instances of MOGs.
SDK initiates handshake with that MOG only.



## Auth Callbacks

These are event callbacks to client code so that clients may know if Auth response was OK or FAIL.

## Websocket Callbacks

Callbacks functions for websocket events - OPEN, CLOSED, MESSAGE_RECEIVED, ERROR etc

## Speech Recognition Callbacks

Callbacks functions for Speech Recognition events - STARTED, ENDED, TRANSCRIPT, ERROR etc

## Media Callbacks

Callbacks functions for Media events - CONNECTED, MIC STARTED, CAM ENDED etc

## Screen Id

In case if text responses are need to be written to some screen on client side, MO provides utility ScreenManager which takes Div element Id [can be div or text area or any HTML Element]

## Retry

Whether to retro for connection in case if it fails initially. It tries for X number times and then give up.

# 11. MO SDK Deployment Steps

## Latest Deployment Steps

`cd /opt/client/sdk/`

`git  pull`

`npm run build`

If there is some Error, run 

`npm install`

Then build again

`npm run build`

It updates SDK, which is pointed in the NGINX config on the url namespace - /sdk/

For more details, Please refer:
https://docs.google.com/document/d/1Q3aceuF2KCifGOJ98Mqn_w_hJ-tWVPkS0trZRXkI7W8/edit#heading=h.vsury8al2wr7
https://docs.google.com/document/d/1JZuXi-Aw4rPoOJc-c2jSfjT3u_FWl2a8f5hJKNZTqPE/edit#heading=h.o9nfnzmscd31

## OLD Deployment Steps

Now we do not use these steps as build can be done directly on MO server as given above.
Steps are same as build steps now as opposed to earlier when we used to copy sdk to MO Server.
Refer Latest Document.

Assumptions:

1. PEM file is in the user folder on Macbook. Otherwise please provide full path of your PEM file.

For example:

`~/ points to  => /Users/rishabhgupta/`

2. Current directory is

`~/Documents/workspace/moclient/sdk/`

1. Copy mo.sdk.js under build folder to www

`sudo scp -i ~/meetonline.pem build/mo.sdk.js ubuntu@18.135.35.185:/opt/moclient/js/sdk/build`

## Demo Room URL's
--Audience URL:     https://meetonline.io/uyu-sagh-oiu
--Broadcastor URL:  https://meetonline.io/xyu-zbgp-ytt
--Moderator URL:    https://meetonline.io/xss-lmii-poo

