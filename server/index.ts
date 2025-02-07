//server initialization
import { createServer } from "http";
import { Server } from "socket.io";
// import socket from "../src/utils/socket";

const httpServer = createServer();

//socket server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//middleware
io.use((socket, next) => {
    const username = socket.handshake.auth.username;

    if (!username) {
        return next(new Error("invalid username"));
    }

    socket.username = username;
    next();

});


io.on("connection", (socket) => {
    //fetch existing users
    let users = [];
    //io.of('/') refers to the default namespace (/)
    //.socket is the map of key ids and value socket instance
    for (const [id, socket] of io.of('/').sockets) {
        users.push({
            userId: id,
            username: socket.username
        })

    }
    //emit to connected client
    socket.emit("users", users);

    //notify all existing users of the client connection

    socket.broadcast.emit("user connected", () => {
        userID: socket.id,
            username: socket.username
    })


})

httpServer.listen(3001, () => {
    console.log("socket is listening on 3001")
})

export { httpServer, io }


//grab and use = for of looop; each element of a array is picked and we do something with it