import { socket } from "../socket/socket.io";
import kurentoUtils from "kurento-utils";

export function sendMessage(message) {
  console.log(message);
  socket.emit("message", message);
}

export function resgisterResponse(message) {
  if (message.response === "accepted") {
    alert("Registered");
  } else {
    var errorMessage = message.message
      ? message.message
      : "Unknown reason for register rejection.";
    console.log(errorMessage);
    alert("Error registering user. See console for further information.");
  }
}

export function call(peer, name, setWebRtcPeer) {
  if (peer === "") {
    alert("You must specify the peer name");
    return;
  }
  const videoInput = document.getElementById("videoInput");
  const videoOutput = document.getElementById("peer");
  var options = {
    localVideo: videoInput,
    remoteVideo: videoOutput,
    onicecandidate: onIceCandidate,
    mediaConstraints: {
      audio: true,
      video: true,
    },
  };

  console.log(options);

  const webRtcPeer1 = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
    options,
    function (error) {
      if (error) {
        console.log("hii");
        console.error(error);
      }

      this.generateOffer(function (error, offerSdp) {
        if (error) {
          console.error(error);
        }
        var message = {
          id: "call",
          from: name,
          to: peer,
          sdpOffer: offerSdp,
        };
        sendMessage(message);
      });
    }
  );
  setWebRtcPeer(webRtcPeer1);
}

function onIceCandidate(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
  };
  sendMessage(message);
}

export function register(name) {
  if (name === "") {
    alert("Empty");
    return;
  }
  var message = {
    id: "register",
    name: name,
  };
  sendMessage(message);
}

export function callResponse(message, webRtcPeer) {
  console.log("Response");
  if (message.response !== "accepted") {
    console.info("Call not accepted by peer. Closing call");
    var errorMessage = message.message
      ? message.message
      : "Unknown reason for call rejection.";
    console.log(errorMessage);
    stop(true, webRtcPeer);
  } else {
    if (webRtcPeer) {
      webRtcPeer.processAnswer(message.sdpAnswer);
    }
    setTimeout(() => {
      if (webRtcPeer) {
        webRtcPeer.processAnswer(message.sdpAnswer);
        console.log("Processed sucessfulyy");
      }
    }, 5000);
    console.log(webRtcPeer, "is still null");
  }
}

export function stop(message, webRtcPeer) {
  console.log("STooppppppingggggg comuntication");
  if (webRtcPeer) {
    webRtcPeer.dispose();
    //webRtcPeer.close();
    webRtcPeer = null;
    if (!message) {
      var message1 = {
        id: "stop",
      };
      sendMessage(message1);
    }
  }
  console.log("Stopper coummunication");
}

export async function incomingCall(message, setWebRtcPeer) {
  const videoInput = document.getElementById("videoInput");
  const videoOutput = document.getElementById("peer");
  var options = {
    localVideo: videoInput,
    remoteVideo: videoOutput,
    onicecandidate: onIceCandidate,
    mediaConstraints: {
      audio: true,
      video: true,
    },
  };
  console.log(options, "incoming call");
  const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
    options,
    function (error) {
      if (error) {
        console.error(error);
      }

      this.generateOffer(function (error, offerSdp) {
        if (error) {
          console.error(error);
        }
        var message1 = {
          id: "incomingCallResponse",
          from: message.from,
          callResponse: "accept",
          sdpOffer: offerSdp,
        };
        sendMessage(message1);
      });
    }
  );
  console.log(webRtcPeer);
  if (!webRtcPeer) {
    console.error("Incoming call not handled properly dude");
    return;
  }
  setWebRtcPeer(webRtcPeer);
}

export function startCommunication(message, webRtcPeer) {
  console.log(webRtcPeer, message);
  if (message && webRtcPeer) {
    webRtcPeer.processAnswer(message.sdpAnswer);
  }
  setTimeout(() => {
    if (webRtcPeer) {
      webRtcPeer.processAnswer(message.sdpAnswer);
      console.log("Answered");
    }
  }, 3000);
  console.log("Error at Communicating");
  return;
}
