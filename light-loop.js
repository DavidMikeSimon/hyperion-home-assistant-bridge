const {
  HA_URL,
  TOKEN,
  TRANSITION_DURATION_DIVIDER,
  AUTO_TURN_OFF,
} = require("./env.js");

const { sleep } = require("./util.js");
const latest_color = require("./latest_color.js");
const { lights } = require("./config.js");

async function send_color(
  light_data,
  color,
  max_brightness,
  duration = 0.18,
  debug = false
) {
  const brightness = color[0] + color[1] + color[2];
  if (debug) {
    console.log({
      light_data,
      brightness,
    });
  }
  let body = {
    entity_id: `light.${light_data.id}`,
    transition: duration,
    brightness: Math.floor(brightness * max_brightness),
  };

  if (light_data.type == "rgb") {
    body.rgb_color = color;
  } else {
    // body.brightness = Math.max(1, Math.round(255 * brightness)); // 0 seems to turn it off and make it slower to react
  }

  if (debug) {
    console.log("sending", body);
  }

  return fetch(`${HA_URL}/api/services/light/turn_on`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(body),
  }).then(async (response) => {
    if (debug) {
      console.log(await response.text());
    }
  });
}

async function turn_off_light(light_data, debug = false) {
  let body = {
    entity_id: `light.${light_data.id}`,
  };

  return fetch(`${HA_URL}/api/services/light/turn_off`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(body),
  }).then(async (response) => {
    if (debug) {
      console.log(await response.text());
    }
  });
}

module.exports = async function light_loop(light_index, max_brightness, debug) {
  light_index = parseInt(light_index);
  let duration = 0.18; // 180ms - the default for start, will be adjusted later based on how long did the http request take
  let last_color = [0, 0, 0];
  let active = false;

  while (true) {
    const from = 3 * light_index;
    const to = 3 * (light_index + 1);
    const current_color = latest_color.get().slice(from, to);
    const start = Date.now();
    let is_changed = false;
    for (i in last_color) {
      if (last_color[i] != current_color[i]) {
        is_changed = true;
        break;
      }
    }
    if (is_changed) {
      active = true;
      if (debug) {
        console.time(`light ${light_index} http request took`);
      }
      await send_color(
        lights[light_index],
        current_color,
        max_brightness,
        duration,
        debug
      );
      duration = (Date.now() - start) / 1000 / TRANSITION_DURATION_DIVIDER;
      if (debug) {
        console.timeEnd(`light ${light_index} http request took`);
      }
      last_color = current_color;
    } else {
      if (
        AUTO_TURN_OFF &&
        active &&
        start - latest_color.get_last_update() > 1000
      ) {
        if (debug) {
          console.log("Turning off light");
        }
        turn_off_light(lights[light_index], debug);
        active = false;
      }

      await sleep(10);
    }
  }
};
