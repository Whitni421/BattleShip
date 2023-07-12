const ws = new WebSocket("ws://localhost:8084");
const URL = "http://localhost:8084/";
ws.addEventListener("open", () => {
  console.log("client connected");
});

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  // use this to make it scalable
  // canvas.width = window.innerWidth - 50;
  // canvas.height = window.innerHeight - 50;

  canvas.style.border = "5px solid red";

  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  let offset_x;
  let offset_y;

  let get_offset = function () {
    let canvas_offsets = canvas.getBoundingClientRect();
    offset_x = canvas_offsets.left;
    offset_y = canvas_offsets.top;
  };

  get_offset();
  window.onscroll = function () {
    get_offset();
  };
  window.onresize = function () {
    get_offset();
  };
  canvas.onresize = function () {
    get_offset();
  };

  let shapes = [];
  let current_shape_index = null;
  let is_dragging = false;
  let startX;
  let startY;
  shapes.push({ x: 700, y: 700, width: 100, height: 100, color: "blue" });

  let is_mouse_in_shape = function (x, y, shape) {
    let shape_left = shape.x;
    let shape_right = shape.x + shape.width;
    let shape_top = shape.y;
    let shape_bottom = shape.y + shape.height;

    if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom)
      return true;
    else return false;
  };

  let mouse_down = function (event) {
    event.preventDefault();

    startX = parseInt(event.clientX - offset_x);
    startY = parseInt(event.clientY - offset_y);

    let index = 0;
    for (let shape of shapes) {
      if (is_mouse_in_shape(startX, startY, shape)) {
        current_shape_index = index;
        is_dragging = true;
        break;
      }
      index++;
    }
  };

  let mouse_up = function (event) {
    if (!is_dragging) return;

    event.preventDefault();
    is_dragging = false;
  };
  let mouse_out = function (event) {
    if (!is_dragging) return;

    event.preventDefault();
    is_dragging = false;
  };

  let mouse_move = function (event) {
    if (!is_dragging) return;
    else {
      event.preventDefault();
      let mouseX = parseInt(event.clientX - offset_x);
      let mouseY = parseInt(event.clientY - offset_y);

      let dx = mouseX - startX;
      let dy = mouseY - startY;

      let current_shape = shapes[current_shape_index];
      current_shape.x += dx;
      current_shape.y += dy;

      draw_shapes();

      startX = mouseX;
      startY = mouseY;
    }
  };

  canvas.onmousedown = mouse_down;
  canvas.onmouseup = mouse_up;
  canvas.onmouseout = mouse_up;
  canvas.onmousemove = mouse_move;

  let draw_shapes = function () {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    for (let shape of shapes) {
      ctx.fillStyle = shape.color;
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
  };

  draw_shapes();

  const boardWidth = 10;
  const boardHeight = 10;
  const cellSize = canvas.width / boardWidth;
  const gridWidth = canvas.width * 0.75;
  const gridHeight = canvas.height * 0.75;
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

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.debug = true;
    this.player = new Player(this);
    this.numberOfObstacles = 10;
    this.obstacles = [];
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    };

    // event listeners
    canvas.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key == "d") this.debug = !this.debug;
    });
  }
  render(context) {
    this.obstacles.forEach((obstacle) => obstacle.draw(context));
    this.player.draw(context);
    this.player.update();
  }

// class Game {
//   constructor(canvas) {
//     this.canvas = canvas;
//   }
// }
// // Game setup code end

// Vue.createApp({
//   data() {
//     return {};
//   },
//   methods: {},
//   created: function () {},
// }).mount("#app");
