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
      addPlayer(username, clientId);
    }
    msg = JSON.parse(message);
    if (msg.EventType == "attack") {
      attackFunction(msg.Data);
    }
    if (msg.EventType == "parrot") {
      parrotFunction(msg.Data);
    }
  });
  ws.on("close", function () {
    const clientId = clients.get(ws);
    if (clientId) {
      const gameIndex = openGames.findIndex((game) => game[0] === clientId);
      if (gameIndex !== -1) {
        console.log(
          openGames[gameIndex][1] + " client disconnected from queue"
        );
        openGames.splice(gameIndex, 1);
      }
    }
    // Remove the client from the clients map
    clients.delete(ws);
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    client.send("username is" + message);
  });
}

function addPlayer(player, id) {
  //makes a tuple and adds it to the list of players looking for a game
  openGames.push([id, player]);
  var indexvar = 0;
  if (openGames.length > 1) {
    if (playingGames == undefined) {
      indexvar = 0;
    } else {
      indexvar = playingGames.length;
    }
    console.log(indexvar);

    playingGames.push(new game(openGames[0], openGames[1], indexvar));
    openGames.shift();
    openGames.shift();
    console.log(indexvar);
    console.log(playingGames[indexvar]);
    playingGames[indexvar].player1.id.send(
      JSON.stringify({
        EventType: "initialize",
        Data: prepareSend(playingGames[indexvar], "player1"),
      })
    );
    playingGames[indexvar].player2.id.send(
      JSON.stringify({
        EventType: "initialize",
        Data: prepareSend(playingGames[indexvar], "player2"),
      })
    );
  }
}
//prepares data to be sent
function prepareSend(object, player) {
  if (player === "player1") {
    return {
      player1: {
        name: object.player1.name,
        board: object.player1.board,
      },
      player2: {
        name: object.player2.name,
        board: replaceFiveWithZero(object.player2.board),
      },
      index: object.index,
    };
  } else if (player === "player2") {
    return {
      player1: {
        name: object.player1.name,
        board: replaceFiveWithZero(object.player1.board),
      },
      player2: {
        name: object.player2.name,
        board: object.player2.board,
      },
      index: object.index,
    };
  }
}
function replaceFiveWithZero(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 5) {
        arr[i][j] = 0;
      }
    }
  }
  return arr; // Return the modified array
}
class game {
  constructor(player1, player2, varindex) {
    console.log(varindex);
    this.player1 = {
      name: player1[1],
      id: player1[0],
      index: varindex,
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
      name: player2[1],
      id: player2[0],
      index: varindex,
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
    this.index = varindex;
  }
}

function attackFunction(data) {
  game = playingGames[data.index];
  if (data.player == "player1") {
    if (game.player2.board[data.cords[0]][data.cords[1]] == 5) {
      game.player2.board[data.cords[0]][data.cords[1]] = 3;
    } else if (game.player2.board[data.cords[0]][data.cords[1]] == 0) {
      game.player2.board[data.cords[0]][data.cords[1]] = 1;
    }
    sendData("Attack", data.index);
  }
  if (data.player == "player2") {
    if (game.player1.board[data.cords[0]][data.cords[1]] == 5) {
      game.player1.board[data.cords[0]][data.cords[1]] = 3;
    } else if (game.player1.board[data.cords[0]][data.cords[1]] == 0) {
      game.player1.board[data.cords[0]][data.cords[1]] = 1;
    }
    sendData("Attack", data.index);
  }
}
function sendData(type, indexvar) {
  playingGames[indexvar].player1.id.send(
    JSON.stringify({
      EventType: type,
      Data: prepareSend(playingGames[indexvar], "player1"),
    })
  );
  playingGames[indexvar].player2.id.send(
    JSON.stringify({
      EventType: type,
      Data: prepareSend(playingGames[indexvar], "player2"),
    })
  );
}
function parrotFunction(data) {
  return;
}
