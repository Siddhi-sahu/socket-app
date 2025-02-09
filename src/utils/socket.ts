//client initiliation

import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3001";
interface customSocket extends Socket {
    username?: string
}

//client connecting to server url
const socket: customSocket = io(URL, {
    autoConnect: false
});

socket.onAny((event, ...args) => {
    console.log(event, args);
})

export default socket;