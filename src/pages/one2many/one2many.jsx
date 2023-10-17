import { useEffect, useState } from "react";

import kurentoUtils from "kurento-utils";
import {
  presenterResponse,
  viewerResponse,
  sendMessage,
  dispose,
  onIceCandidate,
} from "./functions";
import { socket } from "../socket/socket.io";

export function One2Many() {
  const [video, setVideo] = useState(null);
  const [webRtcPeer, setWebRtcPeer] = useState(null);
  const [remote, setRemote] = useState([]);
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    const vid = document.getElementById("presenter");
    setVideo(vid);
    socket.on("clientSide", (message) => {
      console.log(message, "recived on client Side");
      switch (message.id) {
        case "presenterResponse":
          presenterResponse(message, webRtcPeer, setWebRtcPeer);
          break;
        case "viewerResponse":
          setViewers((prev) => [...prev, socket.id]);
          setRemote((prev) => [...prev, socket.id]);
          viewerResponse(message, webRtcPeer, setWebRtcPeer);
          break;
        case "stopCommunication":
          dispose(webRtcPeer, setWebRtcPeer);
          break;
        case "iceCandidate":
          webRtcPeer.addIceCandidate(message.candidate);
          break;
        default:
          return socket.emit("error", {
            id: "error",
            message: "Fucking default Error",
          });
      }
    });
  }, [webRtcPeer]);

  function presenter() {
    const videoInput = document.getElementById("presenter");
    const videoOutput = document.getElementById("remote");
    var options = {
      localVideo: videoInput,
      remoteVideo: videoOutput,
      onicecandidate: onIceCandidate,
    };

    console.log(options);

    const webRtc = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
      options,
      function (error) {
        if (error) {
          console.log(error, "at 63");
          return;
        }
        this.generateOffer(function (error, offerSdp) {
          if (error) {
            console.error(error);
          }
          console.log(offerSdp);
          var message = {
            id: "presenter",
            sdpOffer: offerSdp,
          };
          sendMessage(message);
        });
      }
    );

    setWebRtcPeer(webRtc);
  }

  function onOfferViewer(error, offerSdp) {
    if (error) return onError(error);

    var message = {
      id: "viewer",
      sdpOffer: offerSdp,
    };
    sendMessage(message);
  }

  function viewer() {
    if (!webRtcPeer) {
      var options = {
        remoteVideo: video,
        onicecandidate: onIceCandidate,
      };

      const web1 = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        function (error) {
          if (error) return onError(error);

          this.generateOffer(onOfferViewer);
        }
      );
      setWebRtcPeer(web1);
    }
  }

  function onError(error, reason) {
    console.error(error, reason);
  }

  function stop() {
    if (webRtcPeer) {
      var message = {
        id: "stop",
      };
      sendMessage(message);
      dispose();
    }
  }

  return (
    <div>
      <h2>Remote Videos</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "90%",
          height: "400px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {viewers &&
          viewers.map((e, i) => {
            return (
              <video
                id={`viewer${i}`}
                key={Date.now() + i + Math.random() * 100}
                autoPlay
                style={{
                  width: "30%",
                  height: "200px",
                  border: "1px solid black",
                }}
              ></video>
            );
          })}
      </div>
      <button onClick={viewer}>Join</button>
      <h2>Local Video</h2>
      <video
        id="presenter"
        autoPlay
        style={{ width: "300px", height: "100px", border: "1px solid black" }}
      ></video>
      <video
        id="remote"
        autoPlay
        style={{ width: "300px", height: "100px", border: "1px solid black" }}
      ></video>
      <button onClick={() => presenter()}>Start Presenting</button>

      <button onClick={stop}>Stop</button>
    </div>
  );
}
