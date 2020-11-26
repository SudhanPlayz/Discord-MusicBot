const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const fs = require('fs');


module.exports = {
  info: {
    name: "pause",
    description: "24/7",
    usage: "[afk]",
    aliases: [""],
  },

  run: async function (client, message, args) {
    let prefix = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
       if (!prefix[message.guild.id]) prefix[message.guild.id] = {
        prefix: false,
    };
    var serverQueue = prefix[message.guild.id]
       if (serverQueue) {
            serverQueue.prefix = !serverQueue.prefix;
             message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  AFK is **\`${serverQueue.prefix === true ? "enabled" : "disabled"}\`**`
                }
            });
            return  fs.writeFile("./afk.json", JSON.stringify(prefix), (err) => {
        if (err) console.error(err);
    });
        };
    return sendError("There is nothing playing in this server.", message.channel);
  },
};
