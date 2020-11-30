const { MessageEmbed } = require('discord.js');

module.exports = {
    info: {
      name: "ping",
      description: "To show the ping of the bot.",
      usage: "",
      aliases: ["botping"],
    },
   
    run: async function (client, message, args)
    {
        message.reply('Calculating ping...').then((resultMessage) => {
          const ping = resultMessage.createdTimestamp - message.createdTimestamp
    
          resultMessage.edit(`***PONG!!***

**Bot latency**: ${ping} ,
**API Latency**: ${client.ws.ping}`)
        })
      },
    }