import client from "../..";
import Auth from "../middlewares/auth";

const { Router } = require("express");
const api = Router();

api.get("/", Auth, (req, res) => {
    let data = {
        commandsRan: client.commandsRan,
        users: client.users.cache.size,
        servers: client.guilds.cache.size,
        songsPlayed: client.songsPlayed
    }
    res.json(data);
})

export default api;