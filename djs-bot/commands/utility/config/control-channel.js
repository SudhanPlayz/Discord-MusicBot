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
			.addChannelTypes(
				...[
					ChannelType.GuildText,
					ChannelType.GuildVoice,
					ChannelType.GuildStageVoice,
					ChannelType.PublicThread,
				]
			)
		)
	);

	return baseCommand.setSubCommandHandler(
		"control-channel",
		async function (client, interaction, options) {
			const channel = options.getChannel("channel", false);

			const guildId = interaction.guild.id;
			const channelId = channel?.id || null;

			try {
				await client.db.guild.upsert({
					where: {
						guildId,
					},
					create: { controlChannelId: channelId, guildId },
					update: { controlChannelId: channelId },
				});
			} catch (e) {
				client.error(e);

				return interaction.reply("Error updating config");
			}

			const reply = !channelId ? "Control channel reset!" : "Control channel set!";

			return interaction.reply(reply);
		}
	);
};
