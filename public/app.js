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
      this.drawGrid();
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.username = { username: "" };
      this.ships = [];
      this.parrot = true; //parrot sprite width and height 90, 65
      //kraken sprite width and height 95, 75
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

    attack(coordinates) {}

    createShips() {
      //spriteX spriteY spriteWidth spriteHeight x y width height
      let ship5 = new Ship(
        5,
        this,
        100,
        70,
        80,
        300,
        this.game.width - 190,
        0,
        90,
        500
      );
      this.ships.push(ship5);

      let ship4 = new Ship(
        4,
        this,
        250,
        70,
        100,
        160,
        this.game.width - 90,
        0,
        100,
        180
      );
      this.ships.push(ship4);

      let ship4_2 = new Ship(
        4,
        this,
        250,
        70,
        100,
        160,
        this.game.width - 90,
        180,
        100,
        180
      );
      this.ships.push(ship4_2);

      let ship3 = new Ship(
        3,
        this,
        40,
        40,
        60,
        150,
        this.game.width - 190,
        240,
        100,
        150
      );
      this.ships.push(ship3);

      let ship3_2 = new Ship(
        3,
        this,
        40,
        40,
        60,
        150,
        this.game.width - 90,
        360,
        100,
        150
      );
      this.ships.push(ship3_2);

      let ship2 = new Ship(
        2,
        this,
        190,
        70,
        60,
        80,
        this.game.width - 150,
        390,
        90,
        100
      );
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
      }
    }
  }

  class Ship {
    constructor(
      type,
      player,
      spriteX,
      spriteY,
      spriteWidth,
      spriteHeight,
      x,
      y,
      width,
      height
    ) {
      //spriteX spriteY spriteWidth spriteHeight x y width height
      this.player = player;
      this.rotation = false;
      this.location = [];
      this.sunk = false;
      this.type = type;
      this.image = document.getElementById("ship");
      this.spriteX = spriteX;
      this.spriteY = spriteY;
      this.spriteWidth = spriteWidth;
      this.spriteHeight = spriteHeight;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
      canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
      canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    // Handle drag and drop for ships
    handleMouseDown(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        x >= this.x &&
        x < this.x + this.width &&
        y >= this.y &&
        y < this.y + this.height
      ) {
        this.isDragging = true;
        this.startX = x - this.x;
        this.startY = y - this.y;
        return;
      }
    }

    handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.isDragging) {
        this.x = x - this.startX;
        this.y = y - this.startY;
        // this.player.game.drawGrid();
        this.draw();
        return;
      }
    }

    handleMouseUp(e) {
      if (this.isDragging) {
        this.isDragging = false;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridX = Math.floor(mouseX / this.player.game.cellSize);
        const gridY = Math.floor(mouseY / this.player.game.cellSize);

        // Calculate the snapped position within the grid
        this.x = gridX * this.player.game.cellSize;
        this.y = gridY * this.player.game.cellSize;

        // Update the board with the new location
        // this.insertShips();

        this.player.game.drawGrid();
        this.changed = true;
        this.draw();
        return;
      }
    }

    draw() {
      //spriteX spriteY spriteWidth spriteHeight x y width height
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
      userRequired: false,
      backgroundAudio: new Audio("/sound/background.mp3"), // Replace with the path to your audio file
      isAudioPlaying: false,
      musicToggle: false,
      audioVolume: 0.01,
      UserChat: [],
      UserInput: "",
      player: "",
      GameIndex: -1,
    };
  },
  mounted() {
    // Start playing the audio when the Vue instance is mounted
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
          this.player = msg.Data.player;
          this.GameIndex = msg.Data.index;
          console.log(this.player);
        }
        if (msg.EventType == "playerDisconnect") {
          console.log("Player disconnected");
          console.log(msg.Data);
          this.page = 4;

          console.log(this.page);
        }
        if (msg.EventType == "SendMessage") {
          console.log(msg);
          this.UserChat.push(msg.Data.Username + ": " + msg.Data.Message);
          const chatLogContainer = this.$refs.chatLogContainer;
          chatLogContainer.scrollTop = chatLogContainer.scrollHeight;
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
      if (this.username.trim() != "") {
        if (!this.isAudioPlaying) {
          this.toggleAudio();
        }
        this.page = 2;
        this.userRequired = false;
        this.socket.send(
          JSON.stringify({
            EventType: "username",
            Data: { user: this.username },
          })
        );
      } else {
        this.userRequired = true;
      }
    },
    toggleAudio() {
      this.backgroundAudio.loop = true;
      this.backgroundAudio.volume = this.audioVolume;
      this.isAudioPlaying = !this.isAudioPlaying;
      if (this.isAudioPlaying) {
        this.playAudio();
      } else {
        this.pauseAudio();
      }
    },
    playAudio() {
      this.backgroundAudio.play();
    },
    pauseAudio() {
      this.backgroundAudio.pause();
    },
    setAudioVolume() {
      this.backgroundAudio.volume = this.audioVolume;
    },
    sendChat() {
      if (this.UserInput) {
        this.socket.send(
          JSON.stringify({
            EventType: "SendMessage",
            Data: {
              Message: this.UserInput,
              Index: this.GameIndex,
              Player: this.player,
              Username: this.username,
            },
          })
        );

        this.UserChat.push(this.username + ": " + this.UserInput);
        this.UserInput = "";
        const chatLogContainer = this.$refs.chatLogContainer;
        chatLogContainer.scrollTop = chatLogContainer.scrollHeight;
      }
    },
  },
  created: function () {
    this.connect();
  },
}).mount("#app");
