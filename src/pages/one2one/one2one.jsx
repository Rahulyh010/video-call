import React, { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket/socket.io";
import {
  register,
  resgisterResponse,
  call,
  callResponse,
  stop,
  incomingCall,
  startCommunication,
} from ".";
import {
  Button,
  Call,
  EndButton,
  Flex,
  Input,
  LargeVideoBox,
  VideoBox,
  VideoContainer,
} from "./styles";

export const One2One = () => {
  //const [registeredName, setRegisteredName] = useState("");
  const [webRtcPeer, setWebRtcPeer] = useState(null);
  const [peer, setPeer] = useState("");
  const [name, setName] = useState("");
  // const [videoInput, setVideoInput] = useState(null);
  // const [videoOutput, setVideoOutput] = useState(null);
  //const videoInput = document.getElementById("videoInput");
  //const videoOutput = document.getElementById("peer");
  //console.log(webRtcPeer, videoInput, videoOutput);

  useEffect(() => {
    console.log(socket);
    // const videoInput1 = document.getElementById("videoInput");
    // const videoOutput1 = document.getElementById("peer");
    // setVideoInput(videoInput1);
    // setVideoOutput(videoOutput1);
    //console.log(videoInput, videoOutput);
    socket.on("clientSide", (message) => {
      console.log(message.id, "message Recived on Client side");
      if (
        !webRtcPeer &&
        message.id !== "registerResponse" &&
        message.id !== "incomingCall"
      ) {
        console.log(webRtcPeer, "is null");
        return;
      }
      switch (message.id) {
        case "registerResponse":
          resgisterResponse(message);
          break;
        case "callResponse":
          callResponse(message, webRtcPeer);
          break;
        case "incomingCall":
          console.log("Incomming Call Recieved");
          incomingCall(message, setWebRtcPeer);
          break;
        case "startCommunication":
          startCommunication(message, webRtcPeer);
          break;
        case "stopCommunication":
          console.log("Communication ended by remote peer");
          stop(true, webRtcPeer);
          break;
        case "iceCandidate":
          if (webRtcPeer && message.candidate) {
            webRtcPeer.addIceCandidate(message.candidate);
          } else {
            console.error("error at iceCandidate");
          }
          break;
        default:
          socket.emit("error", { id: "error", error: "error" });
      }
    });
  }, [webRtcPeer]);

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <VideoContainer>
          <LargeVideoBox autoPlay id="videoInput" />
          <VideoBox autoPlay id="peer" />
        </VideoContainer>
        <div style={{ width: "30%" }}>
          <Flex
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              marginTop: "200px",
            }}
          >
            <Input
              type="text"
              placeholder="Register Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              style={{ backgroundColor: "#a4a6a3" }}
              onClick={() => register(name)}
            >
              Register
            </Button>
          </Flex>
          <Flex style={{ width: "400px", marginTop: "20px" }}>
            <Input
              type="text"
              placeholder="Peer Name"
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
            />
          </Flex>
        </div>
      </div>

      <div
        style={{
          width: "300px",
          height: "auto",
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Call onClick={() => call(peer, name, setWebRtcPeer)}>Call</Call>
        <EndButton onClick={() => stop(false, webRtcPeer)}>End</EndButton>
      </div>
    </div>
  );
};
