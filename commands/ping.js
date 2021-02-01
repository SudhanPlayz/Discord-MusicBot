const discord = require("discord.js");

module.exports = {
info: {
name: "ping",
description: "To see the ping of the bot",
usage: "[ping]",
aliases: ["pg"],
},

run: async (client, message, args) => {

let embed = new discord.MessageEmbed()
.setDescription(`Ping - ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`)
.setColor("RANDOM")
.setFooter(`Requested by ${message.author.username}`)

message.channel.send(embed)
}
}
