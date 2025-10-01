import type { Socket, Server } from "socket.io";

// generate a random 4-letter room code
const RoomCodeGenerator = (): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// pass in both socket (per connection) and io (server)
const socketConnections = (socket: Socket) => {
  // create room
  socket.on("createRoom", () => {
    const id = RoomCodeGenerator();
    socket.join(id);
    socket.emit("roomCreated", id);
    console.log(`Room created: ${id} by ${socket.id}`);
  });

  // join room
  socket.on("joinRoom", (id: string) => {
    socket.join(id);
    socket.emit("roomJoined", id);
    socket.to(id).emit("userJoined", socket.id); // notify peers
    console.log(`Socket ${socket.id} joined room ${id}`);
  });

  // relay signaling messages
  socket.on("message", (data) => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id); // rooms this socket is in
    if (rooms.length === 0) return;

    const room = rooms[0]; 
    if(!room){
        return;
    }
    socket.to(room).emit("message", data);
  });

  // handle disconnect
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    // optional: notify others in the same room
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("message", { type: "bye" });
      }
    });
  });
};

export { socketConnections };
