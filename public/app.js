const ws = new WebSocket("ws://localhost:8080");
const URL = "http://localhost:8080/";
var canvas;
var ctx;
ws.addEventListener("open", () => {
  console.log("client connected");
});

window.addEventListener("DOMContentload", function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth * 0.75;
  canvas.height = window.innerHeight * 0.9;
  canvas.style.border = "5px solid black";

  window.onresize = function () {
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.9;
  };

  class Game {
    constructor() {
      this.width = canvas.width;
      this.height = canvas.height;
      this.topMargin = 260;
      this.debug = true;
      this.player = new Player(this);
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };
      this.gridHeight = canvas.height;
      this.gridSize = 10;
      this.cellSize = this.gridHeight / this.gridSize;
      this.gridWidth = this.cellSize * this.gridSize;
    }
    gridLines = () => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      2;
      for (var row = 0; row < this.gridSize; row++) {
        for (var col = 0; col < this.gridSize; col++) {
          ctx.beginPath();
          ctx.strokeRect(
            col * this.cellSize,
            row * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          ctx.stroke();
        }
      }
    };

    drawGrid = () => {
      console.log("drawGrid");
      ctx.clearRect(0, 0, this.gridWidth, this.gridHeight);
      this.gridLines();

      // Highlight the cell on mouse hover
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const row = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);

        // Clear previous highlight
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        this.gridLines();

        if (row < this.gridSize && col < this.gridSize) {
          ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
          ctx.fillRect(
            col * this.cellSize,
            row * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
        this.player.draw();
      });
    };
    render() {
      this.player.draw();
      this.drawGrid(ctx);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.username = { username: "" };
      this.ships = [];
      this.parrot = true;
      this.board = [
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
    }

    createShips() {
      let ship5 = new Ship(5, this);
      this.ships.push(ship5);
      // for i in range(2) in javascript
      for (let i = 0; i < 2; i++) {
        let ship = new Ship(4, this);
        this.ships.push(ship);
      }
      for (let i = 0; i < 2; i++) {
        let ship = new Ship(3, this);
        this.ships.push(ship);
      }
      let ship2 = new Ship(2, this);
      this.ships.push(ship2);
    }

    insertShips() {
      for (location in this.ships.location) {
        this.board[location[0]][location[1]] = 5;
      }
    }
    draw() {
      for (let ship of this.ships) {
        ship.draw();
      }
    }

    insertParrot(coordinates) {
      if (this.parrot == true) {
        hover = [
          this.board[coordinates[0]][coordinates[1]],
          this.board[coordinates[0 + 1]][coordinates[1]],
          this.board[coordinates[0]][coordinates[1 + 1]],
          this.board[coordinates[0 + 1]][coordinates[1 + 1]],
        ];
        for (i in hover) {
          if (i == 5) {
            i = 2;
            i.classList.add(".hit");
          }
          if (i == 0) i = 1;
          i.classList.add(".revealed");
        }
      } else {
        pass;
      }
    }
  }

  class Ship {
    constructor(type, player) {
      this.player = player;
      this.rotation = false;
      this.location = [];
      this.sunk = false;
      this.type = type;
      this.image = document.getElementById("ship");
      this.spriteX = 0;
      this.spriteY = 0;
      this.spriteWidth = 840 / 4;
      this.spriteHeight = 858 / 4;
      this.x = 1000;
      this.y = 100;
      this.width = 100;
      this.height = 100;
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      canvas.addEventListener("mousedown", this.startDragging.bind(this));
      canvas.addEventListener("mousemove", this.drag.bind(this));
    }

    startDragging(event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (
        mouseX >= this.x &&
        mouseX <= this.x + this.width &&
        mouseY >= this.y &&
        mouseY <= this.y + this.height
      ) {
        this.isDragging = true;
        this.startX = mouseX - this.x;
        this.startY = mouseY - this.y;
      }
    }

    drag(event) {
      if (this.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        this.x = mouseX - this.startX;
        this.y = mouseY - this.startY;
      }
    }

    stopDragging(event) {
      // Snap the ship to the nearest grid square
      const gridX = Math.floor(
        (this.x + this.width / 2) / this.player.game.cellSize
      );
      const gridY = Math.floor(
        (this.y + this.height / 2) / this.player.game.cellSize
      );

      // Calculate the snapped position within the grid
      this.x = gridX * this.player.game.cellSize;
      this.y = gridY * this.player.game.cellSize;
      this.isDragging = false;
    }

    draw() {
      ctx.drawImage(
        this.image,
        this.spriteX,
        this.spriteY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );

      // let mouse_up = (e) => {
      //   console.log("mouse up");
      //   e.preventDefault();
      //   // Snap the ship to the nearest grid square
      //   const gridX = Math.floor(
      //     (this.x + this.width / 2) / this.player.game.cellSize
      //   );
      //   const gridY = Math.floor(
      //     (this.y + this.height / 2) / this.player.game.cellSize
      //   );

      //   // Calculate the snapped position within the grid
      //   this.x = gridX * this.player.game.cellSize;
      //   this.y = gridY * this.player.game.cellSize;
      // };
      // canvas.onmouseup = mouse_up;
    }
  }
  function init() {
    const game = new Game(canvas);
    game.player.createShips();
    game.render(ctx);
  }

  init();
});

Vue.createApp({
  data() {
    return {
      page: 1,
      username: "",
      player_turn: 0,
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
      this.socket.onmessage = (event) => {
        console.log(event.data);
        msg = JSON.parse(event.data);
        if (msg.EventType == "initialize") {
          console.log("success");
          console.log(msg.Data);
          this.page = 3;
          console.log(this.page);
        }
        if (msg.EventType == "playerDisconnect") {
          console.log("Player disconnected");
          console.log(msg.Data);
          this.page = 4;
          console.log(this.page);
        }
      };
    },
    checkSunk: function () {
      var count = 0;
      for (i in Game.player.ships) {
        for (location in locations) {
          if (board[locations] != 3) {
            return;
          } else {
            count++;
          }
          if (count == location.length) {
            Ship.sunk = true;
          }
        }
        if (Ship.sunk == true) {
          for (location in locations) {
            location.classList.add(".sunk");
          }
        }
      }
    },
    load_screen: function () {
      // Send username through websocket
      this.page = 2;
      this.socket.send(
        JSON.stringify({
          EventType: "username",
          Data: { user: this.username },
        })
      );
    },
  },
  created: function () {
    this.connect();
  },
}).mount("#app");

