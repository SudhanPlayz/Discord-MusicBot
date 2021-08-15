module.exports = {
  Admins: ["UserID", "UserID"], //Admins of the bot
  ExpressServer: true,//If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || "miko", //Default prefix, Server Admins can change the prefix
  Port: 6969, //Which port website gonna be hosted
  SupportServer: "https://dsc.gg/vulix", //Support Server Link
  Token: process.env.Token || "ODYwMTMyMjM2Njc0MDcyNTg2.YN2ykQ.zKZMWml5DBJeKLbYUy7r02h5blM", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "860132236674072586", //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || "j-mLS6D7LCFZM9YSw6Zje70cFLGgHenK", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": false, //If you want the bot to be stay in the vc 24/7
  CookieSecret: "miiko is cool", //A Secret like a password
  IconURL:
    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  Permissions: 2205280576, //Bot Inviting Permissions
  Website: process.env.Website || "https://miiko.xyzmic.cf", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
   Lavalink: {
    id: "Main",
    host: "de2.exoticnodes.xyz",
    port: 25624,
    pass: "miikoisgud", 
  },
  
  //Alternate Lavalink
  /*
  Lavalink: {
    id: "Main",
    host: "lava.sudhan.tech",
    port: 1234,
    pass: "CodingWithSudhan", 
  },
  */

  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "f4e654894fb147fdbfc55c7a68ad3631", //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "615745ddad0b4313ac1cd3ef4efbb7c2", //Spotify Client Secret
  },
};
