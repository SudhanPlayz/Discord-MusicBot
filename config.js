module.exports = {
  token: process.env.token || "", //Bot's Token
  clientId: process.env.clientId || "", //ID of the bot
  clientSecret: process.env.clientSecret || "", //Client Secret of the bot
  port: 3000, //Port of the API and Dashboard
  scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  serverDeafen: process.env.sdeafen || "", //If you want bot to stay deafened
  defaultVolume: process.env.dvolume || "", //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  supportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
  permissions: 2205281600, //Bot Inviting Permissions
  nodes: [
    {
      identifier: "Main",
      host: process.env.llhost || "", //lavalink host
      port: process.env.llport || "", //lavalink port
      password: process.env.llpass || "", //lavalink password
      //retryAmount: 5, - Optional
      //retryDelay: 1000, - Optional
      //secure: false - Optional | Default: false
    },
  ], //Lavalink servers
  embedColor: process.env.ecolor || "", //Color of the embeds
  presence: {
    //PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
    status: process.env.status || "", // You can have online, idle, and dnd
    activities: [
      {
        name: process.env.statustext || "", //Status Text
        type: process.env.statustype || "", // PLAYING, WATCHING, LISTENING, STREAMING
        url: process.env.surl || "", // Link streaming url
      },
    ],
  },
  iconURL: process.env.icon || "", //This icon will be in every embed's author field
};
