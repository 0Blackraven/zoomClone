import Express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"
import { random } from "./rpcService/service.ts"
import type {Socket} from "socket.io"
import { socketConnections } from "./socketConnections.ts"

const app = Express();

app.use(cors({
    origin: "*",
    methods: "*",
    credentials: false  //do true after setting origins and methods
}));
app.use(Express.json);

const server = createServer(app);
const io = new Server(server,{
    cors:({
        origin: "*",
        methods: "*",
        credentials: false // set to true later 
    })
});

io.on("connection", (socket:Socket) =>{
    socket.emit("connected", "hello");
    socketConnections(socket);
});

io.on("error", (error)=>{
    console.log(error.message);
});

server.listen(8080, ()=>{
    console.log("connected to port");
})

// random();

export { io , app };