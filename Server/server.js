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
const openGames = [];
const playingGames = [];
// 2: Assign name to server
const server = app.listen(port, function () {
  console.log(`Running server on port ${port}...`);
});

// 3: Name websocket
const wss = new WebSocket.Server({ server: server });

// Data structure to store client information
const clients = new Map();

wss.on("connection", function (ws) {
  // This is the new client connection
  console.log("New `ws` client connected");
  // Generate a unique ID for the client
  const clientId = generateClientId();

  // Store client information
  clients.set(ws, clientId);

  // Handle message through websocket
  ws.on("message", function incoming(message) {
    if (message.toString().startsWith("<username>")) {
      var username = message.toString().replace("<username>", "");
      const clientId = clients.get(ws);
      // client.set(clientid, ws);
      console.log(clientId);
      addPlayer(username, clientId);
    }
    if (message.toString().startsWith("<attack>")) {
      var username = message.toString().replace("<username>", "");
      console.log("Got a message through WS: ", username);
      broadcast(username);
    }
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
    client.send("username is" + message);
  });
}

function addPlayer(player, id) {
  //makes a tuple and adds it to the list of players looking for a game
  openGames.push([id, player]);
  if (openGames.length > 1) {
    playingGames.push(
      new game(openGames[0], openGames[1]),
      playingGames.length - 1
    );
    openGames.shift();
    openGames.shift();
    console.log(playingGames);
  }
}
//creates random id
function generateClientId() {
  return Date.now();
}
class game {
  constructor(player1, player2, index) {
    this.player1id = player1[0];
    this.player1name = player1[1];
    this.player2name = player2[1];
    this.player2id = player2[0];
    this.index = index;
  }
}
