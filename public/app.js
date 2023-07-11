const ws = new WebSocket("ws://localhost:8080");
const URL = "http://localhost:8080/";
ws.addEventListener("open", () => {
  console.log("client connected");
});

board = [
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
];

const boardWidth = 10;
const boardHeight = 10;

// Game setup code start
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  const cellSize = canvas.width / boardWidth;
  const gridWidth = canvas.width * 0.7;
  const gridHeight = canvas.height * 0.8;
  ctx.fillStyle = "black";

  function gridLines() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    for (let x = 0; x <= gridWidth; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gridHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gridWidth, y);
      ctx.stroke();
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gridLines();

    // Highlight the cell on mouse hover
    canvas.addEventListener("mousemove", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);

      // Clear previous highlight
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      gridLines();
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    });
  }

  drawGrid();
});

class Player {
  constructor() {
    this.username = { username: "" };
    this.ships = [];
    this.parrot = true;
    this.board = board;
  }

  insertParrot(){
    if (this.parrot == true){
    }
    else{
    }
  }

  createShips() {
    let ship5 = new Ship(5);
    this.ships.push(ship5);
    for (i in Range(2)) {
      let ship = new Ship(4);
      this.ships.push(ship);
    }
    for (i in Range(2)) {
      let ship = new Ship(3);
      this.ships.push(ship);
    }
    let ship2 = new Ship(2);
    this.ships.push(ship2);
  }

  insertShips() {
    for (location in this.ships.location) {
      this.board[location[0]][location[1]] = 5;
    }
  }
}

class Ship {
  constructor(type) {
    this.rotation = false;
    this.location = [];
    this.sunk = false;
    this.type = type;
  }
}



Vue.createApp({
  data() {
    return {
      page: "page1",
      username: 0,
    };
  },
  methods: {
    connect: function () {
      // 1: Connect to websocket
      const protocol = window.location.protocol.includes("https")
        ? "wss"
        : "ws";
      this.socket = new WebSocket(`${protocol}://localhost:8080`);
      this.socket.onopen = function () {
        console.log("Connected to websocket");
      };
      this.socket.onmessage = function (event) {
        console.log("WS message:", event.data);
      };
    },
    load_screen: function () {
      // Send message through websocket
      this.page = "page2";
      this.socket.send("<username>" + this.username);
    },
    getMessageWS: function () {
      // Get message through websocket
      this.socket.onmessage = function (event) {
        console.log(event.data);
        if (event == "<waiting>") {
          page = "page2";
        }
        if (event == "<playing>"){
          page = "page3";
        }
      };
    },
  },
  created: function () {
    this.connect();
  },
}).mount("#app");
