# Use any Home Assistant lights with Hyperion

## Setup:

1. Clone this respository;

2. Edit `config.js` to your liking. There are two light types: `rgb` and
   `dim`. The names of the lights must represent light entity id that are
   present in Home Assistant;

3. Generate a Home Assistant Token using the /profile view (scroll to the bottom
   of the view);

4. Setup a new LED instance in Hyperion using the `udpraw` controller. Set the
   number of lights to the amount of lights you've specified in the `config.js`
   file;

5. Run `HA_TOKEN=your_token12341234123432 node .`
