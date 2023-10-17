import { socket } from "../socket/socket.io";

export function presenterResponse(message, webRtcPeer, setWebRtcPeer) {
  if (message.response !== "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.warn("Call not accepted for the following reason: " + errorMsg);
    dispose(setWebRtcPeer);
  } else {
    webRtcPeer.processAnswer(message.sdpAnswer);
  }
}

export function viewerResponse(message, webRtcPeer, setWebRtcPeer) {
  if (message.response !== "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.warn("Call not accepted for the following reason: " + errorMsg);
    dispose(webRtcPeer, setWebRtcPeer);
  } else {
    webRtcPeer.processAnswer(message.sdpAnswer);
  }
}

export function dispose(webRtcPeer, setWebRtcPeer) {
  if (webRtcPeer) {
    webRtcPeer.dispose();
    setWebRtcPeer(null);
  }
  // hideSpinner(video);
}

export function sendMessage(message) {
  socket.emit("message", message);
}

export function onIceCandidate(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
  };
  sendMessage(message);
}
