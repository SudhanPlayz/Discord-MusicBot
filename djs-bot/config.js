// Allows for .env files to be imported and used
require('dotenv').config()

// exporting the module allows for other files to see all the properties in this file as a single object
module.exports = {
	/** @type {string} */
	name: "InsertNameHereBot", // A fancy name to give your bot :D
	/** @type {string}*/
	db_url: process.env.DATABASE_URL || "", // URL to the database (Prisma ORM)

	/**
	 * Secret information, use the ENV file to store these values if possible
	 */
	/** @type {string | string[]} */
	ownerId: process.env.DEVUID || ["AdminID"], //Admin of the bot
	/** @type {string} */
	token: process.env.TOKEN || "", //Bot's Token
	/** @type {string} */
	clientId: process.env.CLIENTID || "", //ID of the bot
	/** @type {string} */
	clientSecret: process.env.CLIENTSECRET || "", //Client Secret of the bot

	/**
	 * Lavalink configuration
	 */
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	// Or host one yourself -> https://github.com/freyacodes/Lavalink 
	//--> https://github.com/melike2d/lavalink
	//--> https://darrennathanael.com/post/how-to-lavalink/
	/** @type {string} */
	musicEngine: "Erela", // (case sensitive) Only Erela is supported for now
	/** @type {import("erela.js").Node[]} */
	nodes: [
		{
			identifier: "DockerNode", // log id string
			host: "host.docker.internal",
			port: 2333,
			password: "youshallnotpass",
			retryAmount: 15, // for lavalink connection attempts [Erela.js]
			retryDelay: 6000, // Delay between reconnect attempts if connection is lost. [Erela.js]
			secure: false, // if SSL lavalink
		},
		/* {
			identifier: "Lavalink 2", 
			host: "",
			port: 80,
			password: "password",
			retryAmount: 15, 
			retryDelay: 6000, 
			secure: false, 
		}, */
	],

	/** 
	 * Invite URL parameters
	 */
	/** @type {import("discord.js").OAuth2Scopes[]} */
	scopes: ["bot", "applications.commands"], // Scopes for the bot
	/** 
	@type {import("discord.js").PermissionResolvable | bigint} 
	@see https://discord.com/developers/docs/topics/permissions#permissions
	*/
	permissions: 0, // 8 = Administrator, 0 = Doesn't need permissions (uses slash commands)

	/**
	 * Debug switches
	 */
	/** @type {number} */
	OPLevel: 1, // alternative to the previous two, works on inclusion:
	// 0 = No debug logging, 1 = Standarn Logging, 2 = Development (contains debug)

	/**
	 * Other parameters used variously throughout the bot
	 */
	/** @type {import('discord.js').ColorResolvable} */
	embedColor: "Random", //Color of the embeds (can also be hex) (check the table below)

	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		/** @type {import("discord.js").PresenceStatus} */
		status: "online", // online, idle, dnd, invisible, ...

		/**
		 @type {{
			name: string,
			type: import("discord.js").ActivityType,
			data?: (client: import("./lib/Bot")) => { [key: string]: any }
		 }[]}
		 */
		activities: [
			{
				name: "{someVariable}",
				type: "WATCHING",
				data: (client) => {
					return {
						someVariable: client.guilds.cache.size,
					}
				}
			},
			{
				name: "Music",
				type: "LISTENING",
			}
		],
	},
	//This icon will be in every embed's author field, if you don't want it, just leave it blank or "undefined"
	/** @type {string} */
	iconURL: undefined,
};
