import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Spinning the http server and the WebSocket server.
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// I'm maintaining all active connections in this object
const clients = {};

// A new client connection request received
wsServer.on('connection', (connection) => {
  // Generate a unique code for every user
  const userId = uuid();

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on('close', () => handleDisconnect(userId));
});

const handleDisconnect = (userId) => {
    console.log(`${userId} disconnected.`);
    delete clients[userId];
}
