const { lights } = require("./config.js");

let latest_color = [];
let last_update = null;

// initialize
for (let i in lights) {
  for (let j = 1; j <= 3; j++) {
    latest_color.push(1);
  }
}

module.exports = {
  get: () => {
    return latest_color;
  },

  get_last_update: () => {
    return last_update;
  },

  set: (new_color) => {
    // because sometimes protobuf disconnects and I don't know why
    if (new_color.every((n) => n == 0)) {
      return;
    }
    latest_color = new_color;
    last_update = Date.now();
  },
};
