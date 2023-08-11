const { SlashCommandBuilder } = require("@discordjs/builders");
const Bot = require("./Bot");
const {
	CommandInteractionOptionResolver,
	CommandInteraction,
} = require("discord.js");
// https://discordjs.guide/popular-topics/builders.html#slash-command-builders

// Extending the main discord.js slash command builder class to facilitate the
// construction of commands using methods instead of properties
class SlashCommand extends SlashCommandBuilder {
	constructor() {
		super();
		this.type = 1; // "CHAT_INPUT"
		return this;
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

	/**
	 * Set the available autocomplete options for a string command option
	 * @param {(input: string, index: number, interaction: CommandInteraction, client:Bot) => Promise<{name:string, value:string}[]>} autocompleteOptions a function that returns an array of autocomplete options
	 */
	setAutocompleteOptions(autocompleteOptions) {
		this.autocompleteOptions = autocompleteOptions;
		return this;
	}

	/**
	 * @discordjs/builders doesn't export SlashSubCommandBuilder class so we can't modify it
	 * We have to implement subcommand handler in the main class
	 */
	handleSubcommandInteraction() {}
}

module.exports = SlashCommand;
