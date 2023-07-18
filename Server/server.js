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
  const clientId = ws;

  // Store client information
  clients.set(ws, clientId);

  // Handle message through websocket
  ws.on("message", function incoming(message) {
    if (message.toString().startsWith("<username>")) {
      var username = message.toString().replace("<username>", "");
      const clientId = clients.get(ws);
      // client.set(clientid, ws);
      console.log(username);
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
webSocket.on("close", function (ws) {
  delete w[userID];
  console.log("deleted: " + userID);
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
    var index = playingGames.length;
    playingGames.push(
      new game(openGames[0], openGames[1]),
      playingGames.length
    );
    openGames.shift();
    openGames.shift();
    playingGames[index].player1id.send(
      json.stringify(playingGames[index].player1)
    );
    playingGames[index].player2id.send(
      json.stringify(playingGames[index].player2)
    );
  }
}
class game {
  constructor(player1, player2, index) {
    this.player1 = {
      Name: player1[0],
      id: player1[1],
      player2name: player2[0],
      index: index,
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
    this.player2 = {
      Name: player2[0],
      id: player2[1],
      player1name: player1[0],
      index: index,
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
    // this.player1id = player1[0];
    // this.player1name = player1[1];
    // this.player2name = player2[1];
    // this.player2id = player2[0];
    this.index = index;
  }

  sendBoards() {
    this.player1id.send("testing");
    this.player2id.send("testing");
  }
}
