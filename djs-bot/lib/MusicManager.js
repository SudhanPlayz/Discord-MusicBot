const getConfig = require("../util/getConfig");
const Bot = require("./Bot");

// Possibly?
/* const { Engine } = require(`./clients/${await getConfig().musicEngine}`) */


/**
 * Music Manager
 * =============
 * The class is used as an interface with all the music clients in the bot's client folder
 * acts as an API for the music clients and allows for easy switching between clients
 * @returns {MusicManager}
 */
class MusicManager {

	/**
	 * @param {Bot} client
	 */
	constructor(client) {
		/** @type {
			import('./clients/Erela.js') | 
			import('./clients/Shoukaku.js')
		} */
		this.Engine = require(`./clients/${client.config.musicEngine}`);
	}
}

module.exports = MusicManager;