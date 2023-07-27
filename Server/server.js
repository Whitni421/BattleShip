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
class game {
  constructor(player1, player2, varindex) {
    this.player1 = {
      name: player1[1],
      id: player1[0],
      index: varindex,
      updated: true,
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
      updated: false,
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
    this.turn = "player1";
  }
}
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
    msg = JSON.parse(message);
    //checks message events
    if (msg.EventType == "username") {
      var username = msg.Data.user;
      const clientId = clients.get(ws);
      // client.set(clientid, ws);
      addPlayer(username, clientId);
    }
    if (msg.EventType == "attack") {
      attackFunction(msg.Data);
    }
    if (msg.EventType == "parrot") {
      parrotFunction(msg.Data);
    }
    if (msg.EventType == "UpdateBoard") {
      updateBoard(msg.Data);
    }
    if (msg.EventType == "SendMessage") {
      console.log(msg);
      sendMessage(msg.Data);
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
      // Find the game where the disconnected player was playing
      const game = playingGames.find(
        (game) => game.player1.id === clientId || game.player2.id === clientId
      );

      if (game) {
        const otherPlayer =
          game.player1.id === clientId ? game.player2.id : game.player1.id;

        // Notify the other player about the disconnection
        otherPlayer.send(
          JSON.stringify({
            EventType: "playerDisconnect",
            Data: { message: "Your opponent has disconnected from the game." },
          })
        );

        // Remove the game object from the playingGames array
        const gameIndex = playingGames.indexOf(game);
        if (gameIndex !== -1) {
          playingGames.splice(gameIndex, 1);
          console.log("Game removed from playingGames array.");
        }
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
    playingGames.push(new game(openGames[0], openGames[1], indexvar));
    openGames.shift();
    openGames.shift();
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
  if (player == "player1") {
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
      player: "player1",
      turn: object.turn,
    };
  } else if (player == "player2") {
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
      player: "player2",
      turn: object.turn,
    };
  }
}
function replaceFiveWithZero(array) {
  arr = array;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 5) {
        arr[i][j] = 0;
      }
    }
  }
  return arr; // Return the modified array
}

//attack function
function attackFunction(data) {
  game = playingGames[data.index];
  //checks to see if player is one
  if (data.player == "player1") {
    //if there is a ship at location it changes it to attacked ship if not it changes it to miss
    if (game.player2.board[data.cords[0]][data.cords[1]] == 5) {
      game.player2.board[data.cords[0]][data.cords[1]] = 3;
    } else if (game.player2.board[data.cords[0]][data.cords[1]] == 0) {
      game.player2.board[data.cords[0]][data.cords[1]] = 1;
    }
    changeTurn(data.index);
    sendData("Attack", data.index);
  }
  //checks to see if player2
  if (data.player == "player2") {
    //if there is a ship at location it changes it to attacked ship if not it changes it to miss
    if (game.player1.board[data.cords[0]][data.cords[1]] == 5) {
      game.player1.board[data.cords[0]][data.cords[1]] = 3;
    } else if (game.player1.board[data.cords[0]][data.cords[1]] == 0) {
      game.player1.board[data.cords[0]][data.cords[1]] = 1;
    }
    changeTurn(data.index);
    sendData("Attack", data.index);
  }
}
//function sends data back to players
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
function checkWin(game) {
  return;
}

//updates boards after player creates them
function updateBoard(data) {
  var index = data.index;
  game = playingGames[index];
  //updates player ones board when created
  if (data.player == "player1") {
    game.player1.board = data.board;
    game.player1.updated = true;
    console.log("Player 1 board updated:", game.player1.board);
  }
  //updates player twos board on server when created
  if (data.player == "player2") {
    game.player2.board = data.board;
    game.player2.updated = true;
    console.log("Player 2 board updated:", game.player2.board);
  }
  //once both players create a board it sends the boards back to players
  if (game.player2.updated && game.player1.updated) {
    sendData("updateBoards", index);
  }
}

function sendMessage(data) {
  var game = playingGames[data.Index];
  if (data.Player == "player1") {
    game.player2.id.send(
      JSON.stringify({
        EventType: "SendMessage",
        Data: {
          Message: data.Message,
          Username: data.Username,
        },
      })
    );
  } else if (data.Player == "player2") {
    game.player1.id.send(
      JSON.stringify({
        EventType: "SendMessage",
        Data: {
          Message: data.Message,
          Username: data.Username,
        },
      })
    );
  }
}

function parrotFunction(data) {
  return;
}
function changeTurn(data) {
  if (playingGames[data].turn == "player1") {
    playingGames[data].turn = "player2";
  } else {
    playingGames[data].turn = "player1";
  }
}
