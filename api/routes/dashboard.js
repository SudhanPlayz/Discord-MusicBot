const { Router } = require("express");
const api = Router();
const { getClient } = require("../../");
const Auth = require("../middlewares/auth");

api.get("/", Auth, (req, res) => {
	const client = getClient();
	let data = {
		commandsRan: client.commandsRan,
		users: client.users.cache.size,
		servers: client.guilds.cache.size,
		songsPlayed: client.songsPlayed,
	}
	res.json(data);
})

module.exports = api
