const { SlashCommandBuilder } = require("@discordjs/builders");
const {
	CommandInteraction,
	CommandInteractionOptionResolver,
} = require("discord.js");
const DiscordMusicBot = require("./DiscordMusicBot");

class SlashCommand extends SlashCommandBuilder {
	constructor() {
		super();
		this.type = 1;
		return this;
	}
	
	/**
	 * Set Execution of the command
	 * @param {(client: DiscordMusicBot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => Promise<any>} callback
	 */
	setRun(callback) {
		this.run = callback;
		return this;
	}
}

module.exports = SlashCommand;
