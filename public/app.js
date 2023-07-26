const ws = new WebSocket("ws://localhost:8080");
const URL = "http://localhost:8080/";
var canvas;
var ctx;
ws.addEventListener("open", () => {
  console.log("client connected");
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
      modal: false,
    };
  },
  mounted() {
    // Start playing the audio when the Vue instance is mounted
    if (this.page === 3) {
      this.loadCanvas();
    }
  },
  methods: {
    loadCanvas() {
      if (this.page == 3) {
        // window.addEventListener("load", function () {
        canvas = document.getElementById("canvas");
        console.log(canvas);
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth * 0.5;
        canvas.height = window.innerHeight * 0.6;
        canvas.style.border = "5px solid black";
        const ship = document.getElementById("ship");

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
            // ctx.clearRect(0, 0, this.width, this.height);
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

            canvas.addEventListener("mousedown", (e) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              this.gridLines();
              this.player.draw();
            });

            canvas.addEventListener("mouseup", (e) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              this.gridLines();
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
              200,
              this.game.width - 90,
              this.game.height - 360,
              90,
              280
            );
            this.ships.push(ship5);

            let ship4 = new Ship(
              4,
              this,
              250,
              70,
              100,
              160,
              this.game.width - 170,
              this.game.height - 360,
              100,
              224
            );
            this.ships.push(ship4);

            let ship4_2 = new Ship(
              4,
              this,
              250,
              70,
              100,
              160,
              this.game.width - 250,
              this.game.height - 360,
              100,
              230
            );
            this.ships.push(ship4_2);

            let ship3 = new Ship(
              3,
              this,
              40,
              50,
              60,
              150,
              this.game.width - 160,
              0,
              100,
              185
            );
            this.ships.push(ship3);

            let ship3_2 = new Ship(
              3,
              this,
              40,
              50,
              60,
              150,
              this.game.width - 90,
              0,
              100,
              185
            );
            this.ships.push(ship3_2);

            let ship2 = new Ship(
              2,
              this,
              190,
              70,
              60,
              80,
              this.game.width - 240,
              40,
              90,
              125
            );
            this.ships.push(ship2);
          }

          draw() {
            for (let ship of this.ships) {
              ship.draw();
            }
          }

          insertShips() {
            const gridSize = this.game.gridSize - 1;

            // Clear the board
            for (let i = 0; i < gridSize; i++) {
              for (let j = 0; j < gridSize; j++) {
                this.board[i][j] = 0;
              }
            }

            // Loop through each ship and update the board with its position
            for (let ship of this.ships) {
              // Calculate the starting grid coordinates based on the ship's position
              const startGridX = ship.col;
              const startGridY = ship.row;

              // Depending on the ship's orientation, set the corresponding cells on the board to the ship's type (e.g., 5 for ship5, 4 for ship4, etc.)
              if (ship.rotation) {
                for (let i = 0; i < ship.type; i++) {
                  if (startGridX + i < gridSize && startGridY < gridSize) {
                    this.board[startGridY][startGridX + i] = 5;
                  }
                }
              } else {
                for (let i = 0; i < ship.type; i++) {
                  if (startGridY + i < gridSize && startGridX < gridSize) {
                    this.board[startGridY + i][startGridX] = 5;
                  }
                }
              }
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
            this.image = ship;
            this.spriteX = spriteX;
            this.spriteY = spriteY;
            this.spriteWidth = spriteWidth;
            this.spriteHeight = spriteHeight;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.mX = x;
            this.mY = y;
            this.row;
            this.col;
            this.isDragging = false;
            this.startX = 0;
            this.startY = 0;
            canvas.addEventListener(
              "mousedown",
              this.handleMouseDown.bind(this)
            );
            canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
            canvas.addEventListener(
              "mousemove",
              this.handleMouseMove.bind(this)
            );
          }

          resetShip() {
            this.x = this.mX;
            this.y = this.mY;
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
              this.y = y;
              this.isDragging = true;
              this.startX = x - this.x;
              this.startY = y - this.y;
              this.player.draw();
              this.draw();
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
              this.x =
                gridX * this.player.game.cellSize -
                this.player.game.cellSize / 4;
              this.y = gridY * this.player.game.cellSize;

              this.row = gridY;
              this.col = gridX;

              // Update the board with the new location
              this.player.insertShips();

              this.changed = true;
              this.player.game.drawGrid();
              this.draw();
              console.log(this.player.board);
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
          console.log("game started");
        }

        init();
        // });
      }
    },
    modalClose: function () {
      this.modal = false;
    },
    modalOpen: function () {
      var h3 = document.createElement("h3");
      h3.classList.add(".modal");
      this.modal = true;
    },
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
          // call loadCanvas here!!
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
        if (this.player_turn == 1) {
          console.log("Player2 made attack");
          this.Attack(index);
          this.player1 = $emit(new Player(msg.Data.player2));
          this.player_turn = 1;
          console.log(this.player_turn);
        }
        if (msg.EventType == "updateBoards") {
          this.player1 = $emit(new Player(msg.Data.player1));
          this.player2 = $emit(new Player(msg.Data.player2));
        }
      };
    },
    checkSunk() {
      for (let ship of this.ships) {
        let isSunk = true;
        for (let location of ship.location) {
          const [row, col] = location;
          if (this.board[row][col] !== 3) {
            isSunk = false;
            break;
          }
        }

        if (isSunk) {
          for (let location of ship.location) {
            const [row, col] = location;
            this.board[row][col] = 4; // Mark the location as "sunk" (value 4)
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
