const DiscordMusicBot = require("./lib/DiscordMusicBot"); 
const client = new DiscordMusicBot();

client.build() // Make sure your config.js is filled out :p

module.exports = client;
