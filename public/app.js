const ws = new WebSocket("ws://localhost:8080");
const URL = "http://localhost:8080/";
ws.addEventListener("open", () => {
  console.log("client connected");
});

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  console.log(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 1000;
  canvas.style.border = "5px solid black";

  // use this to make it scalable
  // canvas.width = window.innerWidth - 50;
  // canvas.height = window.innerHeight - 50;

  const ships = [];
  ships.push({});

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

  let current_shape_index = null;
  let is_dragging = false;
  let startX;
  let startY;

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

  const gridHeight = canvas.height;
  const gridSize = 10;
  const cellSize = gridHeight / gridSize;
  const gridWidth = cellSize * gridSize;

  function gridLines() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    for (var row = 0; row < gridSize; row++) {
      for (var col = 0; col < gridSize; col++) {
        ctx.beginPath();
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.stroke();
      }
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, gridWidth, gridHeight);
    gridLines();

    // Highlight the cell on mouse hover
    canvas.addEventListener("mousemove", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);

      // Clear previous highlight
      ctx.clearRect(0, 0, gridWidth, gridHeight);

      // Draw grid
      gridLines();
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      // ctx.fillRect parameters: x, y, width, height
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
}

class Player {
  constructor() {
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

  insertParrot() {
    if (this.parrot == true) {
    } else {
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
        if (event == "<playing>") {
          page = "page3";
        }
      };
    },
  },
  created: function () {
    this.connect();
  },
}).mount("#app");
