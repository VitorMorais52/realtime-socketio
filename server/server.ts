import { createServer } from "http";
import { Server as ServerSocket } from "socket.io";
import Koa from "koa";

const app = new Koa();
const server = createServer(app.callback());
const io = new ServerSocket(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

const SERVER_HOST = "localhost";
const SERVER_PORT = 8080;

io.on("connection", (socket: any) => {
  console.log("[IO] Connection => Server has a new connection");
  socket.on("chat.message", (data: any) => {
    console.log("[SOCKET] Chat.message => ", data);
    io.emit("chat.message", data);
  });
  socket.on("disconnect", () => {
    console.log("[SOCKET] Disconnect => A connection was disconnected");
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
  console.log("[HTTP] Listen => Press CTRL+C to stop it");
});
