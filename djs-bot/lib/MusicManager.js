const Bot = require("./Bot");

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
		/** @type {
			import('./clients/Erela.js') | 
			import('./clients/Shoukaku.js')
		} */
		this.Engine = require(`./clients/${client.config.musicEngine}`)(client);
	}
}

module.exports = MusicManager;