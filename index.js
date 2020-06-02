require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Enmap = require("enmap");

client.config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.DISCORD_PREFIX,
  api: process.env.GOOGLE_API,
};
client.commands = new Enmap();
client.queue = new Map();

client.once("ready", () =>
  console.log("Ready, Logged in as " + client.user.tag)
);

fs.readdir(__dirname + "/commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log("Loading Command: "+commandName)
  });
});

client.on("message", (message) => {
  if (!message.content.startsWith(client.config.prefix) || message.author.bot)
    return;
  const args = message.content.slice(client.config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  command.run(client, message, args);
});

client.login(client.config.token);
