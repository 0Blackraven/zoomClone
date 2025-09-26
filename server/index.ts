import Express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"

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

io.on("connection", (socket) =>{
    socket.emit("connected", "hello");
});

io.on("error", (error)=>{
    console.log(error.message);
});

server.listen(8080, ()=>{
    console.log("connected to port");
})

export { io, app };