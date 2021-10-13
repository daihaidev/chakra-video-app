

export const render = (rootElement, _moClient) => {
    let user = {};
    console.log("Inside- render--rootElement - ", rootElement);
      let html = `
        <nav class="navbar navbar-dark bg-dark">
            <span class="navbar-brand mb-0 h1">MeetOnline.IO</span>
        </nav>
        <div class="container-fluid" style="height: calc(100vh - 56px);">
            <div class="row border">
                <div class="col-sm-8 border p-4">
                    <video id="activeSpeakerVideo" width="100%" height="450" style="background-color:#000;" playsinline autoplay controls>
                        <source src="./assets/media/bunny.mp4" type="video/mp4">
                    </video>
                    <div class="row px-0 py-3">
                        <div class="col"><video id="prevActiveSpeaker1" width="100%" height="120px" style="  margin-bottom:0px; background-color:#000;" playsinline autoplay></video></div>
                        <div class="col"><video id="prevActiveSpeaker2" width="100%" height="120px" style="  margin-bottom:0px; background-color:#000;" playsinline autoplay></video></div>
                        <div class="col"><video id="prevActiveSpeaker3" width="100%" height="120px" style="  margin-bottom:0px; background-color:#000;" playsinline autoplay></video></div>
                        <div class="col"><video id="prevActiveSpeaker4" width="100%" height="120px" style="  margin-bottom:0px; background-color:#000;" playsinline autoplay></video></div>
                    </div>
                </div>
                
                <div class="col-sm-4 border">
                    <div class="container p-2">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#participants">Participants</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#chat">Chat</a>
                            </li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content">
                            <div id="participants" class="tab-pane active show fade p2"></div>


                            <div id="chat" class="tab-pane">
                                <div id="chatScreen" class="chatScreen">
                                    <!-- CONTENT ADDED HERE DYNAMICALLY by JS CODE -->
                                </div>
                            
                                <div id="chatInputContainerId" class="input-group mb-2">
                                    <textarea id="chatInput" onkeyup="handlePressEnter(event);" class="chatInput form-control shadow-none" placeholder="Type a message here"></textarea>
                                    <div class="input-group-append">
                                    <button class="btn btn-secondary" type="submit" onclick="return sendChatMessage();"><i class="fa fa-send-o" style="font-size:24px"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;

    rootElement.innerHTML = html;  
 }
