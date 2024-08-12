const util = require("util");

// const plugin = require("ih-plugin-api")();
const modbus = require("./app");

(async () => {
 
  let plugin;
  try {
    const opt = getOptFromArgs();
    const pluginapi = opt && opt.pluginapi ? opt.pluginapi : 'ih-plugin-api';
    plugin = require(pluginapi+'/index.js')();
    
    plugin.log("Modbus Master plugin has started.");
    plugin.params = await plugin.params.get();
    plugin.log('Received params...');
    plugin.log("Params:" + util.inspect(plugin.params), 1);
    modbus.channels = await plugin.channels.get();
    if (modbus.channels.length > 0) {
      plugin.log("Received:" + util.inspect(modbus.channels), 1);
      plugin.log(`Received ${modbus.channels.length} channels...`, 1);
    } else {
      plugin.log('Empty channels list!');
      process.exit(2);
    }

    await modbus.start(plugin);
  } catch (err) {
    plugin.exit(8, `Error! Message: ${util.inspect(err)}`);
  }
})();



function getOptFromArgs() {
  let opt;
  try {
    opt = JSON.parse(process.argv[2]); //
  } catch (e) {
    opt = {};
  }
  return opt;
}
