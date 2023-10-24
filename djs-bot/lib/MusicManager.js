const Bot = require("./Bot");
const fs = require("fs");

/**
 * @property { import("./clients/MusicClient.d.ts").MusicClient } Engine
 */
class MusicManager {

	/**
	* Music Manager
	* =============
	* The class is used as an interface with all the music clients in the bot's client folder
	* acts as an API for the music clients and allows for easy switching between clients
	* @param {Bot} client
	* @returns {MusicManager}
	*/
	constructor(client) {
		const clients = fs.readdirSync("./lib/clients").filter((file) => file.endsWith(".js")).map((file) => file.split(".")[0]);
		const specifiedEngine = client.config.musicEngine;

		// check if the music engine is valid
		if (!specifiedEngine) throw new Error("Music engine is not specified in the config file");
		if (!clients.includes(specifiedEngine)) throw new Error(`Music engine "${specifiedEngine}" does not exist`);

		/** @type { import("./clients/MusicClient").MusicClient } */
		this.Engine = require(`./clients/${specifiedEngine}`)(client);

		// validate the music engine		
		if (!this.Engine || !(this.Engine instanceof Object)) {
			throw new Error(`Music engine "${specifiedEngine}" wasn't loaded correctly`);
		}

		client.log(`Music engine "${specifiedEngine}" has been loaded`);
	}
}

module.exports = MusicManager;
