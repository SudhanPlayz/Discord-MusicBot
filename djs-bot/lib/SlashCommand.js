const { SlashCommandBuilder } = require("@discordjs/builders");
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
	 * sets the `run:` property of the command to a callback function using a method
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

	/** sets the intended usage for a command as a string, which will be grabbed by the `help` command
	 * syntax: /<commandName> <args?...>
	 */
	setUsage(usage = '') {
		this.usage = usage;
		return this;
	}

	/**
	 *  sets the intended category for the command, useful for findind mismatches
	 */ 
	setCategory(category = 'misc') {
		this.category = category;
		return this;
	}

	/**
	 * Set permissions for a command
	 */
	setPermissions(permissions = []) {
		this.permissions = permissions;
		return this;
	}
}

module.exports = SlashCommand;