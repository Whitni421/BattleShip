const express = require("express");
const cors = require("cors");

// 1: Require web sockets
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, origin);
    },
  })
);

// 2: Assign name to server
const server = app.listen(port, function () {
  console.log(`Running server on port ${port}...`);
});

// 3: Name websocket
const wss = new WebSocket.Server({ server: server });

wss.on("connection", function (ws) {
  // This is the new client connection
  console.log("New `ws` client connected");

  // Handle message through websocket
  ws.on("message", function incoming(message) {
    console.log("Got a message through WS: ", message.toString());
    broadcast(message.toString());
  });
});

app.post("/messages", function (req, res) {
  // Handle message through HTTP
  console.log("Got a message through HTTP: ", req.body.message);
  broadcast(req.body.message);
  res.sendStatus(200);
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    client.send(message);
  });
}
