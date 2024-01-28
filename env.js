const TOKEN = process.env.HA_TOKEN;
const CONFIG_FILE = process.env.CONFIG_FILE;
const HA_URL = process.env.HA_URL || "http://127.0.0.1:8123";
const PORT = parseInt(process.env.HA_BRIDGE_PORT || "41234");
const TRANSITION_DURATION_DIVIDER = parseInt(process.env.HA_DURATION_DIVIDER || "1");

module.exports = {
  TOKEN,
  CONFIG_FILE,
  HA_URL,
  PORT,
  TRANSITION_DURATION_DIVIDER,
};
