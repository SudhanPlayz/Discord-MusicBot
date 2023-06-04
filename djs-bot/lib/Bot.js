const {
	Client,
	Collection,
	GatewayIntentBits,
} = require("discord.js");
const {
	LoadErrorHandler,
	LoadDebugListeners,
} = require("../util/debug");
const fs = require("fs");
const path = require("path");
const DBMS = require("./DBMS");
const Logger = require("./Logger");
const getConfig = require("../util/getConfig");

const MusicManager = require("./MusicManager");

/**
 * The class groups some useful functions for the client in order to facilitate expandability, maintenance and manageability
 * as well as initialize the bot through it's proprietary methods
 */
class Bot extends Client {
	// This is really the only thing that the DJS API needs to start and log in to
	// the bot application (with the login method in `this.build`),
	// all the other methods and functions are for commodity and EoA
	// https://discordjs.guide/popular-topics/intents.html#privileged-intents
	// https://discord.com/developers/docs/topics/gateway
	constructor(clientOptions = {
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildVoiceStates,
		]
	}) {
		super(clientOptions); //Construct

		this.slash = new Collection();
		this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

		getConfig().then((conf) => {
			this.OPLevel = conf.OPLevel;
			this.config = conf;
			this.boot();

			this.LoadSchedules();
			this.LoadCommands();
			this.LoadEvents();

			this.getChannel = require("../util/getChannel");
			this.getLavalink = require("../util/getLavalink");

			this.ms = require("pretty-ms");

			/** @type {WeakSet<import("discord.js").Message>} */
			this.deletedMessages = new WeakSet();
			/** @type {Array<import("erela.js").Track>} */
			this.playedTracks = new Array();
		});
	}

	// Console logging => "../logs.log"
	// Refer to `./Logger.js`
	// These methods are just for convenience
	log(...data) {
		this.logger.log(data);
	}
	warn(...data) {
		this.logger.warn(data);
	}
	info(...data) {
		this.logger.info(data);
	}
	error(...data) {
		this.logger.error(data);
	}
	silly(...data) {
		this.logger.silly(data);
	}
	debug(...data) {
		this.logger.debug(data);
	}

	printBotInfo() {
		// Denomination (name) of the bot
		this.denom = `${this.config.name}/v${require("../package.json").version} (ID: ${this.config.clientId})`;
		this.warn(`Bot running on OPLevel: ${this.OPLevel}`);

		// Operator mode, for debugging purposes
		switch (this.OPLevel) {
			case 2:
				this.warn("Dev mode [ENABLED]!\n\t`logs.log` for inspections");
			case 1:
				this.warn("Debug mode is [ENABLED]!");
				break;
			default:
				this.info("Debug modes disabled.");
				break;
		}
	}

	boot() {
		this.printBotInfo();
		this.warn("Booting up the bot...\n\t" + this.denom);

		LoadErrorHandler(this);
		LoadDebugListeners(this);

		//checking if all nodes are filled in correctly before passing them to the music client constructor
		//this should prevent the building process from halting if there are invalid nodes
		let nodeChecks = [];
		for (const node of this.config.nodes) {
			if (!node.host || !node.port) this.warn(node.identifier + " Is not filled in correctly");
			else nodeChecks.push(1);
		}
		// If all the checks pass (the array is filled only with `1`) then the Music client can be initialized
		if (nodeChecks.length && nodeChecks.every((status) => status === 1)) {
			this.manager = new MusicManager(this);
		} else this.error("Invalid nodes specified in config.json");

		this.login(this.config.token);

		// DBMS initialization
		if (this.config.db_url)
			try {
				this.db = new DBMS(this);
			} catch (err) {
				this.error("Prisma ORM failed to load");
				this.error(err);
			}
	}

	LoadEvents() {
		let EventsDir = path.join(__dirname, "..", "loaders", "events");
		fs.readdir(EventsDir, (err, files) => {
			if (err) { return this.error(err); }
			else
				files.forEach((file) => {
					/** @type {Function}*/
					const event = require(EventsDir + "/" + file);
					this.on(file.split(".")[0], event.bind(null, this));

					if (this.OPLevel >= 2)
						this.log("Event Loaded: " + file.split(".")[0]);
				});
			this.info("Event listeners have been loaded.")
		});
	}

	LoadSchedules() {
		let SchedulesDir = path.join(__dirname, "..", "loaders", "schedules");
		fs.readdir(SchedulesDir, (err, files) => {
			if (err) { return this.error(err); }
			else
				files.forEach((file) => {
					const schedule = require(SchedulesDir + "/" + file);
					this.once("ready", schedule.bind(null, this));

					if (this.config.OPLevel >= 2)
						this.log("Schedule Loaded: " + file.split(".")[0]);
				});
			this.info("Schedules have been loaded.");
		});
	}

	LoadCommands() {
		let CommandsDir = fs.readdirSync("./commands");
		for (const category of CommandsDir) {
			const commandFiles = fs
				.readdirSync(`./commands/${category}`)
				.filter((file) => file.endsWith(".js"));
			for (const file of commandFiles) {
				/** @type {import("./SlashCommand")} */
				const command = require(`../commands/${category}/${file}`);
				if (!command || !command.run || !command.name) {
					this.error(`Unable to load command: ${file} in [${category.toUpperCase()}] is not a valid command with run function or name`);
				} else {
					try {
						this.slash.set(command.name, command);
					} catch (err) {
						return this.error(err);
					}

					if (this.OPLevel >= 2)
						this.log(`Slash Command Loaded: ${file} from [${category.toUpperCase()}]`);
				}
			}
		}
		this.info("Slash commands have been loaded. Waiting for bot to finish initializing...");
		this.once("ready", async () => {
			try {
				await this.application.commands.set(this.slash);
			} catch (err) {
				return this.error(err);
			}
			this.info("Slash commands have been pushed to application");
			this.silly(this.denom + " is online!");
		});
	}

	/**
	 * Checks if a message has been deleted during the run time of the Bot
	 * @param {import("discord.js").Message} message
	 */
	isMessageDeleted(message) {
		return this.deletedMessages.has(message);
	}

	/**
	 * Marks (adds) a message on the client's `deletedMessages` WeakSet so it's
	 * state can be seen through the code
	 * @param {import("discord.js").Message} message
	 */
	markMessageAsDeleted(message) {
		this.deletedMessages.add(message);
	}
}

module.exports = Bot;
