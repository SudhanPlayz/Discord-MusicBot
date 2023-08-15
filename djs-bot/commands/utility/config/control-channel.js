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
			const channelName = options.getString("channel", false);

			const guildId = interaction.guild.id;

			const setDbControlChannel = async (channelId) => {
				await client.db.guild.upsert({
					where: {
						guildId,
					},
					create: { controlChannelId: channelId, guildId },
					update: { controlChannelId: channelId },
				});
			}

			await interaction.deferReply();

			if (!channelName?.length)
				try {
					await setDbControlChannel(null);

					return interaction.editReply("Control channel reset!");
				} catch (e) {
					client.error(
						"Error removing control channel config in guild:",
						guildId
					);
					client.error(e);

					return interaction.editReply("Error updating config");
				}

			try {
				// just let discord validate the string as some unicode are valid channel name
				const existed = interaction.guild.channels.cache.find((c) => c.name === channelName);

				if (existed) return interaction.editReply("A channel with that name already exist!");

				const createdChannel = await interaction.guild.channels.create({
					name: channelName,
					position: 0,
					reason: "Discord Music Bot Control Channel",
					topic: "Discord Music Bot Control Channel",
					type: ChannelType.GuildText,
				});

				// construct control message

				const controlMessage = await createdChannel.send("!TODO: control channel message and pin the message");

				// controlMessage.pin()

				const channelId = createdChannel.id;

				await setDbControlChannel(channelId);

				return interaction.editReply(`Control channel set <#${channelId}>!`);
			} catch (e) {
				client.error(e);
				if (e.message?.length) return interaction.editReply(e.message);
			}
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
