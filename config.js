module.exports = {
    token: process.env.Token || "",//Bot's Token
    nodes: [{
        identifier: "Main",
        host: "",
        port: 80,
        password: "",
        retryAmount: "",
        retryDelay: "",
        secure: false
    }],//Lavalink servers
    IconURL: "https://github.com/SudhanPlayz/Discord-MusicBot/raw/master/assets/logo.gif",//This icon will be in every embed's author field
    "24/7": false,//If you wanted to keep your bot in voice channel withour leaving
}