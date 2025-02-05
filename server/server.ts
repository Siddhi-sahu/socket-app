import { Socket } from "dgram";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
});

io.on("disconnect", (socket) => {
    console.log("user disconnected: ", socket.id)
});

export { httpServer, io }