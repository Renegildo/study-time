import express from "express";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";
import ws from "ws";
import { Timer } from "./timer";
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();
const wsServer = new ws.Server({ noServer: true });
const clients: Set<ws> = new Set();

wsServer.on("connection", socket => {
  clients.add(socket);
});

app.use(cors());

const timer = new Timer(() => {
  broadcast("reset");
});

const broadcast = (message: string) => {
  for (const client of clients) {
    if (client.readyState === ws.OPEN) {
      client.send(message);
    };
  };
};

app.use("/api", router(timer, broadcast));

setInterval(() => {
  timer.update();
}, 1000);

const server = app.listen(port, () => {
  console.log(`Api running on port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit("connection", socket, request);
  });
});
