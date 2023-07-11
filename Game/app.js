const ws = new WebSocket("ws://localhost:8084");
const URL = "http://localhost:8084/";
ws.addEventListener("open", () => {
  console.log("client connected");
});


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

class Ship {
  constructor(game) {
    this.game = game;
    this.positions = [];
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
  }
}
// Game setup code end

Vue.createApp({
  data() {
    return {
    };
  },
  methods: {
    
  },
  created: function () {},
}).mount("#app");
