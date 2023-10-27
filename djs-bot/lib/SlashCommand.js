const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Bot = require("./Bot");
const {
	EmbedBuilder,
	CommandInteractionOptionResolver,
	CommandInteraction,
} = require("discord.js");
const { getClient } = require("../bot");
const { permissionsConfigMessageMapper } = require("../util/common");
const fuzzysort = require("fuzzysort");
const { levDistance } = require("../util/string");

class SubSlashCommand extends SlashCommandSubcommandBuilder {
	constructor() {
		super();
	}

	/**
	 * Set the available autocomplete options for a string command option
	 * @param {(input: string, index: number, interaction: CommandInteraction, client:Bot) => Promise<{name:string, value:string}[]>} autocompleteOptions a function that returns an array of autocomplete options
	 */
	setAutocompleteOptions(autocompleteOptions) {
		this.autocompleteOptions = autocompleteOptions;
		return this;
	}
}

// https://discordjs.guide/popular-topics/builders.html#slash-command-builders
// Extending the main discord.js slash command builder class to facilitate the
// construction of commands using methods instead of properties
class SlashCommand extends SlashCommandBuilder {
	constructor() {
		super();
		this.type = 1; // "CHAT_INPUT"
		this.permissions = [];
		this.botPermissions = [];
	}

	/**
	 * Overrides the Builder class' addSubcommand method to return a SubSlashCommand
	 * @override
	 * @param {SubSlashCommand | ((SubSlashCommand) => SubSlashCommand)} subcommand
	 */
	addSubSlashCommand(subcommand) {
		const sub =
			typeof subcommand === "function"
				? subcommand(new SubSlashCommand())
				: subcommand;

		this.addSubcommand(sub);
		return sub;
	}

	/**
	 * sets the command run function
	 * @param {(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver)} callback
	 */
	setRun(callback) {
		this.run = callback;
		return this;
	}

	/**
	 * sets a command to be owner accessible only
	 */
	setOwnerOnly() {
		this.ownerOnly = true;
		return this;
	}

	/**
	 * tells the the command if it's using DBMS or not
	 */
	setDBMS() {
		this.usesDb = true;
		return this;
	}

	/**
	 * sets the intended usage for a command as a string, which will be grabbed by the `help` command
	 * syntax: /<commandName> <args?...>
	 * @param {string} usage
	 */
	setUsage(usage = "") {
		this.usage = usage;
		return this;
	}

	/**
	 * sets the intended category for the command, useful for finding mismatches
	 * @param {string} category
	 */
	setCategory(category = "misc") {
		this.category = category;
		return this;
	}

	/**
	 * Set permissions for a command
	 * @param {Array<import("discord.js").PermissionFlags>} permissions an array of permission flags
	 */
	setPermissions(permissions = []) {
		this.permissions = permissions;
		return this;
	}

	setBotPermissions(permissions = []) {
		this.botPermissions = permissions;
		return this;
	}

	/**
	 * Set the available autocomplete options for a string command option
	 * @param {(input: string, index: number, interaction: CommandInteraction, client:Bot) => Promise<{name:string, value:string}[]>} autocompleteOptions a function that returns an array of autocomplete options
	 */
	setAutocompleteOptions(autocompleteOptions) {
		this.autocompleteOptions = autocompleteOptions;
		return this;
	}

	setSubCommandConfig(name, key, value) {
		if (!this.subCommands) this.subCommands = new Map();

		const conf = this.subCommands.get(name) || {};

		conf[key] = value;

		this.subCommands.set(name, conf);
		return true;
	}

	getSubCommandConfig(name, key) {
		const conf = this.subCommands?.get(name);
		if (key) return conf?.[key];
		return conf;
	}

	/**
	 * @discordjs/builders doesn't export SlashSubCommandBuilder class so we can't modify it
	 * We have to implement subcommand handler in the main class
	 */
	async handleSubCommandInteraction(client, interaction, options) {
		const conf = this.getSubCommandConfig(options._subcommand);

		const replied = await SlashCommand.checkConfigs(conf, interaction);
		if (replied) return replied;

		const handler = conf.run;

		if (!handler)
			return interaction.reply(
				"Outdated command, run the `deploy` script to update"
			);

		return handler(client, interaction, options);
	}

	async handleSubCommandAutocomplete(interaction) {
		throw new Error("Not yet implemented");
	}

	setSubCommandHandler(name, cb) {
		this.setSubCommandConfig(name, "run", cb);
		return this;
	}

	getSubCommandHandler(name) {
		return this.getSubCommandConfig(name, "run");
	}

	setSubCommandPermissions(name, permissions = []) {
		this.setSubCommandConfig(name, "permissions", permissions);
		return this;
	}

	getSubCommandPermissions(name) {
		return this.getSubCommandConfig(name, "permissions");
	}

	setSubCommandBotPermissions(name, permissions = []) {
		this.setSubCommandConfig(name, "botPermissions", permissions);
		return this;
	}

	getSubCommandBotPermissions(name) {
		return this.getSubCommandConfig(name, "botPermissions");
	}

	static checkConfigs(config, interaction) {
		const client = getClient();

		let errorMessage;

		if (
			config.ownerOnly === true &&
			!client.config.ownerId.includes(interaction.user.id)
		) {
			errorMessage = "This command is only for the bot developers!";
		} else if (config.usesDb && !client.db) {
			errorMessage =
				"This command uses the database but the bot is not connected to it!";
		}

		if (errorMessage)
			return interaction.reply({
				content: errorMessage,
				ephemeral: true,
			});

		return SlashCommand.checkPermission(config, interaction);
	}

	/**
	 * Autocomplete handler, takes autocomplete options specified in the command properties
	 * and shows them to the user
	 * node_modules\discord.js\src\structures\AutocompleteInteraction.js
	 * @param {import("discord.js").Interaction} interaction
	 * @returns
	 */
	static async checkAutocomplete(interaction) {
		if (!interaction.isAutocomplete()) return;

		const client = getClient();

		// Getting input from user
		/** @type {string} */
		let input = interaction.options.getFocused() || " ";

		// Gets the index of the option in which the user is currently typing
		/** @type {number} */
		const index = interaction.options._hoistedOptions
			.map((option) => option.focused)
			.indexOf(true);

		const slashCommand = client.slash.get(interaction.commandName);

		// Gets the autocomplete options provided by the command
		/** @type {{name:string, value:string}[]} */
		let targets = interaction.options._subcommand
			? await slashCommand?.options
					.find(
						(option) =>
							option.name ===
							interaction.options._subcommand
					)
					.autocompleteOptions(input, index, interaction, client)
			: await slashCommand?.autocompleteOptions?.(
					input,
					index,
					interaction,
					client
			  );

		// guards for outdated/ex other bot command,
		// simply don't respond to render error loading message in the discord client
		if (!targets) return;

		// This should make the algorithm faster by pre preparing the array, but no noticable changes
		targets.forEach((option) => (option.filePrepared = fuzzysort.prepare(option.name)));
		targets.map((option) => option.filePrepared);

		fuzzysort.go(input, targets, {
			threshold: -10000, // Don't return matches worse than this (higher is faster)
			limit: 30, // Don't return more results than this (lower is faster)
			all: false, // If true, returns all results for an empty search

			key: "name", // For when targets are objects
		});

		/*
		// Avoiding calculating levenshteing distances if it's not needed
		if (targets.length > 1) {
			// Assigns Levenshtein distances for each option based on what the user is currently typing
			for (let option of targets) {
				option.levenshteinDistance = levDistance(option.name, input);
			}
			// Sorts the array of targets and displays it according to the Levenshtein distance from the typed value
			targets.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);
		}
                */
		return interaction.respond(targets.slice(0, 24));
	}

	static checkPermission(config, interaction) {
		if (!config.permissions?.length && !config.botPermissions?.length) return;

		const missingUserPerms = [];
		const missingBotPerms = [];

		const member = interaction.guild.members.cache.get(interaction.member.user.id);

		config.permissions?.forEach((permission) => {
			if (!member?.permissions.has(permission.permission || permission))
				missingUserPerms.push(
					"`" + permissionsConfigMessageMapper(permission) + "`"
				);
		});

		for (const permission of config.botPermissions || []) {
			if (
				!interaction.guild.members.me.permissions.has(
					permission.permission || permission
				)
			)
				missingBotPerms.push(
					"`" + permissionsConfigMessageMapper(permission) + "`"
				);
		}

		if (!missingUserPerms.length && !missingBotPerms.length) return;

		const missingPermsEmbed = new EmbedBuilder().setColor(
			getClient().config.embedColor
		);

		if (missingUserPerms.length)
			missingPermsEmbed.addFields([
				{
					name: "You're missing some permissions:",
					value: `${missingUserPerms.join(", ")}`,
				},
			]);

		if (missingBotPerms.length)
			missingPermsEmbed.addFields([
				{
					name: "I'm missing some permissions:",
					value: `${missingBotPerms.join(", ")}`,
				},
			]);

		missingPermsEmbed.setFooter({
			text: "If you think this is a mistake please contact the manager of this bot in this server.",
		});

		return interaction.reply({
			embeds: [missingPermsEmbed],
			ephemeral: true,
		});
	}

	/**
	 * @param {import("discord.js").Interaction} interaction
	 */
	static handleComponentInteraction(interaction) {
		if (!interaction.isMessageComponent()) return;

		const client = getClient();

		const [category, cmd, ...args] = interaction.customId?.split("/") || [];

		if (!category?.length || !cmd?.length) return;

		const command = client.interactionCommands.find(
			(ic) => ic.category === category && ic.name === cmd
		);

		// simply return undefined to pass it to slash handler
		if (typeof command?.run !== "function") return;

		try {
			return command.run(client, interaction, args);
		} catch (err) {
			return interaction[interaction.replied ? "editReply" : "reply"]({
				content: err.message,
				ephemeral: true,
			});
		}
	}
}

module.exports = SlashCommand;
