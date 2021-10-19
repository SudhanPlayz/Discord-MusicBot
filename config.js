module.exports = {
  token: process.env.token || "", //Bot's Token
  clientId: process.env.clientId || "", //ID of the bot
  clientSecret: process.env.clientSecret || "", //Client Secret of the bot
  port: 3000, //Port of the API and Dashboard
  scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  serverDeafen: true, //If you want bot to stay deafened
  defaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  supportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
  permissions: 2205281600, //Bot Inviting Permissions
  nodes: [
    {
      identifier: "Main",
      host: "",
      port: 80,
      password: "",
      //retryAmount: 5, - Optional
      //retryDelay: 1000, - Optional
      //secure: false - Optional | Default: false
    },
  ], //Lavalink servers
  embedColor: "BLUE", //Color of the embeds
  presence: {
    //PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
    status: "idle", // You can have online, idle, and dnd
    activities: [
      {
        name: "Music", //Status Text
        type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
        url: "https://twitch.tv/jeffbezos", // Link streaming url
      },
    ],
  },
  iconURL:
    "https://github.com/SudhanPlayz/Discord-MusicBot/raw/master/assets/logo.gif", //This icon will be in every embed's author field
};
