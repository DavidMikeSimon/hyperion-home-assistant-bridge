const dgram = require("node:dgram");
const fs = require("fs");
const server = dgram.createSocket("udp4");

const { lights } = require("./config.js");
const light_loop = require("./light-loop.js");
const latest_color = require("./latest_color.js");
const { TOKEN, PORT } = require("./env.js");

server.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

const debug = false;
const max_brightness = 0.8;

if (!TOKEN) {
  throw new Error(
    "Provide the Home Assistant Long Lived Token as a HA_TOKEN environment variable. Go to /profile in Home Assistant and scroll down."
  );
}

console.log(
  `Remember to set the Hyperion output controller type to UDPRAW and set it to output ${lights.length} lights`,
);

server.on("message", (msg, rinfo) => {
  latest_color.set(Array.from(msg).map((e) => parseInt(e)));
  if (debug) {
    console.log("Received colors:", latest_color.get());
  }
});

server.on("listening", async () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  for (let i in lights) {
    light_loop(i, max_brightness, debug);
  }
});

server.bind(PORT);
