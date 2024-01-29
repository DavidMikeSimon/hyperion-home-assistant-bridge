const fs = require("fs");

const { CONFIG_FILE } = require("./env.js");

if (!CONFIG_FILE) {
  throw new Error("CONFIG_FILE env var must be a path to your config file.");
}

const { lights } = JSON.parse(fs.readFileSync(CONFIG_FILE));

module.exports = { lights };
