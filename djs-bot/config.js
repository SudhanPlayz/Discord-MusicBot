// Allows for .env files to be imported and used
require('dotenv').config()

// exporting the module allows for other files to see all the properties in this file as a single object
module.exports = {
	name: "InsertNameHereBot", // A fancy name to give your bot :D

	/**
	 * Secret information, use the ENV file to store these values if possible
	 */
	ownerId: process.env.DEVUID || ["AdminID"], //Admin of the bot
	token: process.env.TOKEN || "", //Bot's Token
	clientId: process.env.CLIENTID || "", //ID of the bot
	clientSecret: process.env.CLIENTSECRET || "", //Client Secret of the bot

	/**
	 * Lavalink configuration
	 */
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	// Or host one yourself -> https://github.com/freyacodes/Lavalink 
	//--> https://github.com/melike2d/lavalink
	//--> https://darrennathanael.com/post/how-to-lavalink/
	musicEngine: "Erela", // "Shoukaku" or "Erela" (case sensitive) are supported
	nodes: [
		{
			identifier: "Lavalink 1", // log id string
			host: "narco.buses.rocks",
			port: 2269,
			password: "glasshost1984",
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
	scopes: ["bot", "applications.commands"], // Scopes for the bot
	permissions: 0, // 8 = Administrator, 0 = Doesn't need permissions (uses slash commands)

	/**
	 * Debug switches
	 */
	OPLevel: 1, // alternative to the previous two, works on inclusion:
	// 0 = No debug logging, 1 = Standarn Logging, 2 = Development (contains debug)

	/**
	 * Other parameters used variously throughout the bot
	 */
	embedColor: "Random", //Color of the embeds (can also be hex) (check the table below)
	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		status: "online", // online, idle, dnd, invisible
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
	//This icon will be in every embed's author field
	iconURL: "",
};

/*	Constant colors 
	// These are like macros which can be used in discord.js embeds
RANDOM: changes everytime a new embed is sent
DEFAULT: 0x000000;
WHITE: 0xffffff;
AQUA: 0x1abc9c;
GREEN: 0x57f287;
BLUE: 0x3498db;
YELLOW: 0xfee75c;
PURPLE: 0x9b59b6;
LUMINOUS_VIVID_PINK: 0xe91e63;
FUCHSIA: 0xeb459e;
GOLD: 0xf1c40f;
ORANGE: 0xe67e22;
RED: 0xed4245;
GREY: 0x95a5a6;
NAVY: 0x34495e;
DARK_AQUA: 0x11806a;
DARK_GREEN: 0x1f8b4c;
DARK_BLUE: 0x206694;
DARK_PURPLE: 0x71368a;
DARK_VIVID_PINK: 0xad1457;
DARK_GOLD: 0xc27c0e;
DARK_ORANGE: 0xa84300;
DARK_RED: 0x992d22;
DARK_GREY: 0x979c9f;
DARKER_GREY: 0x7f8c8d;
LIGHT_GREY: 0xbcc0c0;
DARK_NAVY: 0x2c3e50;
BLURPLE: 0x5865f2;
GREYPLE: 0x99aab5;
DARK_BUT_NOT_BLACK: 0x2c2f33;
NOT_QUITE_BLACK: 0x23272a;
*/