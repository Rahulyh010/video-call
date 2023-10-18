import { io } from "socket.io-client";

export const socket = io.connect("https://192.168.1.15:8088");
