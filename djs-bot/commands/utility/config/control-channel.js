const { ChannelType } = require("discord.js");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function controlChannel(baseCommand) {
	baseCommand.addSubcommand((command) =>
		command
		.setName("control-channel")
		.setDescription("Set server control channel")
		.addChannelOption((opt) =>
			opt
			.setName("channel")
			.setDescription(
				"Set this channel as server control channel, leave empty to reset"
			)
			.addChannelTypes(...[
				ChannelType.GuildText,
				ChannelType.GuildVoice,
				ChannelType.GuildStageVoice,
				ChannelType.PublicThread,
			])
		)
	);

	return baseCommand.setSubCommandHandler(
		"control-channel",
		async function (client, interaction, options) {
			console.log("control-channel");
			const channel = options.getChannel("channel", false);

			console.log({
				channel,
			});

			if (!channel) {
				return interaction.reply("Control channel reset!");
			}
		}
	);
};
