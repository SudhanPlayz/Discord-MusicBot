const constant = require('discord.js/src/util/Constants.js')
constant.DefaultOptions.ws.properties.$browser = `Discord iOS`

module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}`);
  await client.user.setActivity("Music", {
    type: "LISTENING",//can be LISTENING, WATCHING, PLAYING, STREAMING
  });
};
