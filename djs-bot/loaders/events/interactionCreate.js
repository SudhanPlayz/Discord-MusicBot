const { Interaction } = require("discord.js");
const Bot = require("../../lib/Bot");
const SlashCommand = require("../../lib/SlashCommand");
const controlChannel = require("../../util/controlChannel");

// Defines whenever a "interactionCreate" event is fired, basically whenever a user writes a slash command in
// a server in which the bot is present

// node_modules\discord.js\typings\index.d.ts:3971
// @interactionCreate: [interaction: Interaction];
// This module checks some properties of the command and determines if it should be ran for that user or not
/**
 *
 * @param {Bot} client
 * @param {Interaction} interaction
 * @returns {Promise<InteractionResponse<boolean>>}
 */
module.exports = async (client, interaction) => {
	const isComponentInteraction = await SlashCommand.handleComponentInteraction(interaction);
	if (isComponentInteraction) return isComponentInteraction;

	const isAutocomplete = await SlashCommand.checkAutocomplete(interaction);
	if (isAutocomplete) return isAutocomplete;

	// Gets general info from a command during execution, if sent then check the guards
	// run only if everything is valid
	if (interaction.isCommand()) {
		const isPrevented = await controlChannel.preventInteraction(interaction);
		if (isPrevented) return isPrevented;

		/** @type {SlashCommand} */
		const command = client.slash.get(interaction.commandName);
		if (!command || !command.run) {
			return interaction.reply(
				"Sorry the command you used doesn't have any run function"
			);
		}

		const replied = await SlashCommand.checkConfigs(command, interaction);
		if (replied) return replied;

		try {
			command.run(client, interaction, interaction.options);
		} catch (err) {
			interaction[interaction.replied ? "editReply" : "reply"]({
				content: err.message,
			});
		}
	}
};
