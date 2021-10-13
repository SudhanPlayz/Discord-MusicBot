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
    }]//Lavalink servers
}