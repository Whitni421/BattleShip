const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New Client Connected!");
  ws.on("close", () => {
    console.log("client has disconnected!");
  });
});
