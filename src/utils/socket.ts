//client initiliation

import { io } from "socket.io-client";

const URL = "http://localhost:3001";

//client connecting to server url
const socket = io(URL, {
    autoConnect: false
});

socket.onAny((event, ...args) => {
    console.log(event, args);
})

export default socket;