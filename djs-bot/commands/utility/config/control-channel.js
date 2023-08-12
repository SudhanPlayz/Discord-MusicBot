const { ChannelType } = require("discord.js");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function controlChannel(baseCommand) {
	const commandName = "control-channel";

	baseCommand.addSubcommand((command) =>
		command
		.setName(commandName)
		.setDescription("Create server control channel")
		.addStringOption((opt) =>
			opt
			.setName("channel")
			.setDescription(
				"Create a channel with this name as server control channel, leave empty to reset"
			)
			.setMaxLength(100)
		)
	);

	baseCommand.setSubCommandHandler(
		commandName,
		async function (client, interaction, options) {
			const channel = options.getString("channel", false);

			const guildId = interaction.guild.id;

			if (!channel?.length)
				try {
					await client.db.guild.upsert({
						where: {
							guildId,
						},
						create: { controlChannelId: null, guildId },
						update: { controlChannelId: null },
					});

					return interaction.reply("Control channel reset!");
				} catch (e) {
					client.error(
						"Error removing control channel config in guild:",
						guildId
					);
					client.error(e);

					return interaction.reply("Error updating config");
				}

			try {
			} catch (e) {
				console.error(e);
			}

			// just let discord validate the string as some unicode are valid channel name

			`Control channel set <#${channelId}>!`;
		}
	);

	baseCommand.setSubCommandBotPermissions(commandName, [
		{
			permission: "ManageChannels",
			message: "creating control channel",
		},
	]);

	return baseCommand;
};
