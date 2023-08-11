const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { LoadErrorHandler, LoadDebugListeners } = require("../util/debug");
const fs = require("fs");
const path = require("path");
const DBMS = require("./DBMS");
const Logger = require("./Logger");
const { app } = require("../api/v1/dist");
const getConfig = require("../util/getConfig");
const MusicManager = require("./MusicManager");

let noBoot = false;

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
	constructor(
		clientOptions = {
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
			],
		}
	) {
		super(clientOptions); //Construct

		this.slash = new Collection();
		this.interactionCommands = new Collection();
		this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

		getConfig().then((conf) => {
			this.OPLevel = conf.OPLevel;
			this.config = conf;
			this.boot();

			this.LoadCommands();

			this.getChannel = require("../util/getChannel");
			this.getLavalink = require("../util/getLavalink");

			this.ms = require("pretty-ms");

			/** @type {WeakSet<import("discord.js").Message>} */
			this.deletedMessages = new WeakSet();
			/** @type {Array<import("cosmicord.js").CosmiTrack>} */
			this.playedTracks = new Array();

			this.commandsRan = 0;
			this.songsPlayed = 0;

			fs.readFile(path.join(__dirname, "..", "registered-global"), (err) => {
				if (err) require("../scripts/global");
			});
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
		this.denom = `${this.config.name}/v${
			require("../package.json").version
		} (ID: ${this.config.clientId})`;
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

		if (noBoot !== false) return;

		this.LoadSchedules();
		this.LoadEvents();

		this.warn("Booting up the bot...\n\t" + this.denom);

		LoadErrorHandler(this);
		LoadDebugListeners(this);

		//checking if all nodes are filled in correctly before passing them to the music client constructor
		//this should prevent the building process from halting if there are invalid nodes
		let nodeChecks = [];
		for (const node of this.config.nodes) {
			if (!node.host || !node.port)
				this.warn(node.identifier + " Is not filled in correctly");
			else nodeChecks.push(1);
		}
		// If all the checks pass (the array is filled only with `1`) then the Music client can be initialized
		if (nodeChecks.length && nodeChecks.every((status) => status === 1)) {
			this.manager = new MusicManager(this);
		} else this.error("Invalid nodes specified in config.json");

		this.login(this.config.token);

		// API initialization (done after the login to prevent lack of info)
		this.api = app(this);

		// DBMS initialization (done after the login to prevent lack of info)
		if (this.config.db_url && this.config.db_url !== "") {
			try {
				this.db = new DBMS(this);
			} catch (err) {
				this.error("Prisma ORM failed to load");
				this.error(err);
				this.db = null;
			}
		} else {
			this.warn("No database URL specified");
			this.db = null;
		}
	}

	LoadEvents() {
		let EventsDir = path.join(__dirname, "..", "loaders", "events");
		fs.readdir(EventsDir, (err, files) => {
			if (err) {
				return this.error(err);
			} else
				files.forEach((file) => {
					/** @type {Function}*/
					const event = require(EventsDir + "/" + file);
					this.on(file.split(".")[0], event.bind(null, this));

					if (this.OPLevel >= 2)
						this.log("Event Loaded: " + file.split(".")[0]);
				});
			this.info("Event listeners have been loaded.");
		});
	}

	LoadSchedules() {
		let SchedulesDir = path.join(__dirname, "..", "loaders", "schedules");
		fs.readdir(SchedulesDir, (err, files) => {
			if (err) {
				return this.error(err);
			} else
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
		const commandPath = path.join(__dirname, "..", "commands");

		const CommandsDir = fs.readdirSync(commandPath);

		for (const category of CommandsDir) {
			const categoryPath = path.join(commandPath, category);

			const files = fs.readdirSync(categoryPath);

			const commandFiles = files.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const commandFilePath = path.join(categoryPath, file);

				/** @type {import("./SlashCommand")} */
				const command = require(commandFilePath);

				this.registerCommand(command, file, categoryPath);
			}

			const commandFolders = files.filter(
				(file) =>
				!commandFiles.includes(file) &&
				fs.statSync(path.join(categoryPath, file)).isDirectory()
			);

			for (const folder of commandFolders) {
				const { commandFolderPath, indexFilePath, folderFiles } =
					this.parseCommandFolder(folder, categoryPath);

				if (!indexFilePath) break;

				/** @type {import("./SlashCommand")} */
				const mainCommand = require(indexFilePath);

				const subFiles = folderFiles.filter((file) => file.endsWith(".js"));

				for (const subFile of subFiles) {
					const subFilePath = path.join(commandFolderPath, subFile);

					const handler = require(subFilePath);

					if (typeof handler !== "function") {
						this.error(
							`Unable to load handler: ${commandFolderPath}, handler isn't a function`
						);

						continue;
					}

					handler(mainCommand);
				}

				const subCommandFolders = subFiles.filter(
					(file) =>
					!subFiles.includes(file) &&
					fs.statSync(path.join(commandFolderPath, file)).isDirectory()
				);

				for (const subCommandFolder of subCommandFolders) {
					if (
						this.loadSubCommand(
							mainCommand,
							commandFolderPath,
							subCommandFolder
						) === true
					)
						break;
				}

				this.registerCommand(mainCommand, folder, commandFolderPath);
			}
		}

		this.loadInteractionCommands();

		this.info(
			"Slash commands have been loaded. Waiting for bot to finish initializing..."
		);

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

	getInviteLink() {
		return `https://discord.com/oauth2/authorize?client_id=${
			this.config.clientId
		}&permissions=${this.config.permissions}&scope=${this.config.scopes
				.join()
				.replace(/,/g, "%20")}`;
	}

	getOauthScopes() {
		return this.config.oauth2Scopes.join(" ");
	}

	loadInteractionCommands() {
		const folderPath = path.join(__dirname, "..", "interactions");

		const commands = fs
			.readdirSync(folderPath)
			.filter((file) => file.endsWith(".js"));

		for (const file of commands) {
			/** @type {import("./SlashCommand")} */
			const command = require(path.join(folderPath, file));
			if (!command || !command.run || !command.name) {
				this.error(
					`Unable to load interaction command: ${file} is not a valid command with run function or name`
				);
			} else {
				try {
					this.interactionCommands.set(command.name, command);
				} catch (err) {
					return this.error(err);
				}

				if (this.OPLevel >= 2) this.log(`Interaction Command Loaded: ${file}`);
			}
		}
	}

	registerCommand(command, file, category) {
		if (!command || !command.run || !command.name) {
			this.error(
				`Unable to load command: ${file} in [${category}] is not a valid command with run function or name`
			);
			return;
		}

		try {
			this.slash.set(command.name, command);
		} catch (err) {
			this.error(`Unable to load command: ${file} in [${category}], error:`);

			this.error(err);
			return;
		}

		if (this.OPLevel >= 2)
			this.log(`Slash Command Loaded: ${file} from [${category}]`);
	}

	/**
	 * Load a subcommand or subcommand group
	 * For loading subcommand group, the handler should have and use its own loader to load its nested subcommand
	 *
	 * @returns {boolean | undefined} whether if the caller loop should stop loading next subcommand
	 */
	loadSubCommand(mainCommand, categoryPath, folder) {
		const { commandFolderPath, indexFilePath } = this.parseCommandFolder(
			folder,
			categoryPath
		);

		if (!indexFilePath) {
			this.error(
				`Unable to load handler: ${commandFolderPath}, no valid handler index file inside subcommand folder`
			);

			return;
		}

		const subCommandHandler = require(indexFilePath);

		if (typeof subCommandHandler !== "function") {
			this.error(
				`Unable to load handler: ${commandFolderPath}, handler isn't a function`
			);

			return;
		}

		subCommandHandler(mainCommand);
	}

	parseCommandFolder(folder, categoryPath) {
		const commandFolderPath = path.join(categoryPath, folder);

		const folderFiles = fs.readdirSync(commandFolderPath);

		let indexFileIdx = folderFiles.findIndex((file) => file === "index.js");

		if (indexFileIdx === -1)
			indexFileIdx = folderFiles.findIndex((file) => file === folder + ".js");

		if (indexFileIdx === -1) {
			this.error(
				`Unable to load command folder: ${commandFolderPath}, main command file not found`
			);

			return {};
		}

		const indexFilePath = path.join(
			commandFolderPath,
			folderFiles.splice(indexFileIdx, 1)[0]
		);

		return {
			commandFolderPath,
			indexFilePath,
			folderFiles,
		};
	}

	static setNoBoot(val) {
		noBoot = val;
	}
}

module.exports = Bot;
