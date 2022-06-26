module.exports = {
	cmdPerPage: 10, //Number of commands per page of help command
	adminId: "UserId", // Admin of the bot
	token: process.env.token || "", //Bot's Token
	clientId: process.env.clientId || "", //ID of the bot
	clientSecret: process.env.clientSecret || "", //Client Secret of the bot
	port: 4200, //Port of the API and Dashboard
	scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
	serverDeafen: true, //If you want bot to stay deafened
	defaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
	supportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
	Issues: "https://github.com/SudhanPlayz/Discord-MusicBot/issues", //Bug Report Link
	permissions: 277083450689, //Bot Inviting Permissions
	disconnectTime: 30000, //How long should the bot wait before disconnecting from the voice channel. in miliseconds. set to 1 for instant disconnect.
	alwaysplay: false, // when set to true music will always play no matter if theres no one in voice channel.
	debug: false, //Debug mode
	cookieSecret: "CodingWithSudhan is epic",//Cookie Secret
	website: "http://localhost:4200",//without the / at the end
	// You need a lavalink server for this bot to work!!!!
	// Lavalink server; public lavalink -> https://lavalink-list.darrennathanael.com/; create one yourself -> https://darrennathanael.com/post/how-to-lavalink
	nodes: [
		{
			identifier: "Main Node", //- Used for indentifier in stats commands.
			host: "", //- The host name or IP of the lavalink server.
			port: 80, // The port that lavalink is listening to. This must be a number!
			password: "", //- The password of the lavalink server.
			retryAmount: 200, //- The amount of times to retry connecting to the node if connection got dropped.
			retryDelay: 40, //- Delay between reconnect attempts if connection is lost.
			secure: false, //- Can be either true or false. Only use true if ssl is enabled!
		},
	],
	embedColor: "#2f3136", //Color of the embeds, hex supported
	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		status: "online", // You can have online, idle, and dnd(invisible too but it make people think the bot is offline)
		activities: [
			{
				name: "Music", //Status Text
				type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
			},
		],
	},
	iconURL: "https://cdn.darrennathanael.com/icons/spinning_disk.gif", //This icon will be in every embed's author field
};
