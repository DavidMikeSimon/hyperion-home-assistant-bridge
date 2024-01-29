const dgram = require("node:dgram");
const server = dgram.createSocket("udp4");

const { lights } = require("./config.js");
const light_loop = require("./light-loop.js");
const latest_color = require("./latest_color.js");
const { TOKEN, PORT, MAX_BRIGHTNESS, DEBUG } = require("./env.js");

server.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

if (!TOKEN) {
  throw new Error(
    "Provide the Home Assistant Long Lived Token as a HA_TOKEN environment variable. Go to /profile in Home Assistant and scroll down."
  );
}

console.log(
  `Remember to set the Hyperion output controller type to UDPRAW and set it to output ${lights.length} lights`
);

server.on("message", (msg, rinfo) => {
  latest_color.set(Array.from(msg).map((e) => parseInt(e)));
  if (DEBUG) {
    console.log("Received colors:", latest_color.get());
  }
});

server.on("listening", async () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  for (let i in lights) {
    light_loop(i, MAX_BRIGHTNESS, DEBUG);
  }
});

server.bind(PORT);
