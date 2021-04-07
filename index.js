require("dotenv").config();//Loading .env
const fs = require("fs");
const { Collection, Client } = require("discord.js");
const { inspect } = require("util")

const client = new Client();//Making a discord bot client
client.commands = new Collection();//Making client.commands as a Discord.js Collection
client.queue = new Map()

client.config = {
  prefix: process.env.PREFIX,
  SOUNDCLOUD: process.env.SOUNDCLOUD_CLIENT_ID
}

//Loading Events
fs.readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log("Loading Event: "+eventName)
  });
});

//Loading Commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log("Loading Command: "+commandName)
  });
});
//Logs All the errors to a channel the user wants remove /* and */ If you want the log errors to the channels and change the CHANNELID to the id you want
/*
process.on('unhandledRejection', (reason, promise) => {
    client.channels.cache.get('CHANNELID').send(`UnhandledRejection\nReason:\n\`\`\`\n${inspect(reason, { depth: 0 })}\n\`\`\` Promise:\n\`\`\`\n${inspect(promise, { depth: 0 })}\n\`\`\``)
})
process.on('uncaughtException', (err, origin) => {
    client.channels.cache.get('CHANNELID').send(`UncaughtException\nError:\n\`\`\`\n${inspect(err, { depth: 0 })}\n\`\`\`\nType: ${inspect(origin, { depth: 0 })}`)
})
process.on('warning', (warn) => {
    client.channels.cache.get('CHANNELID').send(`Warning\nWarn:\n\`\`\`\n${warn.name}\n${warn.message}\n\n${warn.stack}\n\`\`\``)
})
*/

//Logging in to discord
client.login(process.env.TOKEN)
