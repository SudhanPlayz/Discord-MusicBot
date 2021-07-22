module.exports = {
  Admins: ["416466935291576321", "717676378476249149"], //Admins of the bot
  ExpressServer: false,//If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || ">", //Default prefix, Server Admins can change the prefix
  Port: 3000, //Which port website gonna be hosted
  SupportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
  Token: process.env.Token || "ODU1MzUyMDA4Mjc4Mjc4MTQ0.YMxOog.mNjjef_mAFK7H4xVEdjEU52h9-o", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "855352008278278144", //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || "9F3eh0m29Ig3imR8n8OTFU3qSf_kxNlZ", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": false, 
  CookieSecret: "AAAAAhahahahahahah", 
  IconURL:
    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  Permissions: 2205280576, //Bot Inviting Permissions
  Website: process.env.Website || "http://localhost", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
   Lavalink: {
    // add option for the amount of nodes
    // Do not change the ID unless you know what you're doing. -Darren
    // Lavalink 1
    id: "1",
    host: "cookies.linath.net",
    port: 2095,
    pass: "whatwasthelastingyousaid", 
    // Lavalink 2 (Optionals)
    id2: "2",
    host2: "lava.link",
    port2: 2095,
    pass2: "anything as password",
  },
  

  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
  },
};
