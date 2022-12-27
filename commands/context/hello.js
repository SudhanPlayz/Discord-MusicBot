const { ContextMenuCommandBuilder } = require("@discordjs/builders");

var greetings = [
	`How are you?`,
	`I hope you're doing well!`,
	`I hope you're having a great week!`,
	`I hope you're having a wonderful day!`,
	`I hope you've had your coffee already!`,
	`It's me again!`]

module.exports = {
	command: new ContextMenuCommandBuilder().setName("Say Hello").setType(2),
	
	/**
	 * This function will handle context menu interaction
	 * @param {import("../lib/DiscordMusicBot")} client
	 * @param {import("discord.js").GuildContextMenuInteraction} interaction
	 */
	run: (client, interaction, options) => {
		interaction.reply(`Hello <@${interaction.options.getUser("user").id}>, ${greetings[Math.floor(Math.random() * greetings.length)]}`);
	},
};
