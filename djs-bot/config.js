// Allows for .env files to be imported and used
require('dotenv').config()

// exporting the module allows for other files to see all the properties in this file as a single object
module.exports = {
	/**
	 * Name of the bot 
	 * @type {string} */
	name: "InsertNameHereBot",
	/** 
	 * URL to the preferred database (Prisma ORM)
	 * @type {string} */
	db_url: process.env.DATABASE_URL || "",

	/**
	 * Secret information, use the ENV file to store these values if possible
	 */
	/**
	 * UID for the Admin(s) of the bot  
	 * @type {string | string[]} */
	ownerId: process.env.DEVUID || ["AdminID"],
	/** 
	 * Token for bot login
	 * @type {string} */
	token: process.env.TOKEN || "",
	/** 
	 * ID of the bot
	 * @type {string} */
	clientId: process.env.CLIENTID || "",
	/** 
	 * Secret Token for bot login
	 * @type {string} */
	clientSecret: process.env.CLIENTSECRET || "",

	/**
	 * API configuration
	 */
	api: {
		/**
		 * Port to run the API on
		 * @type {number} */
		port: parseInt(process.env.API_PORT) || 8080,
	},

	/**
	 * Lavalink configuration
	 */
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	// Or host one yourself -> https://github.com/freyacodes/Lavalink 
	//--> https://github.com/melike2d/lavalink
	//--> https://darrennathanael.com/post/how-to-lavalink/
	/** 
	 * Music engine to use
	 * @type {keyof typeof import("./lib/clients/MusicClient").Engine} */
	musicEngine: "Erela",
	/** 
	 * Nodes to connect to
	 * @type {import("erela.js").Node[]} */
	nodes: [
		{
			identifier: "DockerNode", // log id string
			host: "docker.lavalink",
			port: 2333,
			password: "youshallnotpass",
			retryAmount: 15, // for lavalink connection attempts
			retryDelay: 6000, // Delay between reconnect attempts if connection is lost.
			secure: false, // if lavalink is running SSL
		},
		{
			identifier: "LocalNode", // log id string
			host: "localhost",
			port: 2333,
			password: "youshallnotpass",
			retryAmount: 15, // for lavalink connection attempts
			retryDelay: 6000, // Delay between reconnect attempts if connection is lost.
			secure: false, // if lavalink is running SSL
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
	/** 
	 * Scopes to request for the bot
	 * @type {import("discord.js").OAuth2Scopes[]}
	 */
	scopes: ["bot", "applications.commands"],

	/** 
	 * Bot oauth scopes
	 * @type {import("discord.js").OAuth2Scopes[]}
	 */
	oauth2Scopes: ["identify", "guilds"],

	/** 
	* Permissions to request for the bot
	* @type {import("discord.js").PermissionResolvable | bigint} 
	* @see https://discord.com/developers/docs/topics/permissions#permissions
	*/
	permissions: 0, // 8 = Administrator, 0 = Doesn't need permissions (uses slash commands)

	/**
	 * Other parameters used variously throughout the bot
	*/
	/** 
	 * Debug mode for the bot
	 * 
	 * 0 = No debug logging (production), 1 = Standard Logging (debug info), 2 = Development (everything)
	 * @type {number} */
	OPLevel: 1,
	/**
	 * Color of the embeds (can also be hex)
	 * @type {import('discord.js').ColorResolvable} */
	embedColor: "Random",

	/** 
	 * PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
	 */
	presence: {
		/** 
		 * online, idle, dnd, invisible, ...
		 * @type {import("discord.js").PresenceStatus} */
		status: "online",

		/**
		 @type {{
			name: string,
			type: import("discord.js").ActivityType,
			data?: (client: import("./lib/Bot")) => { [key: string]: any }
		 }[]}
		 */
		activities: [
			{
				name: "{someVariable} servers",
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
	/** 
	 * This icon will be in every embed's author field, if you don't want it, just leave it blank or "undefined"
	 * @type {string} */
	iconURL: undefined,
};
