const ws = new WebSocket("ws://localhost:8084");
const URL = "http:///localhost:8080/";
ws.addEventListener("open", () => {
  console.log("client connected");
});
Vue.createApp({
  data() {
    return {};
  },
  methods: {},
  created: function () {},
}).mount("#app");
