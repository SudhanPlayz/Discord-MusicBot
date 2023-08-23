const { ChannelType, OverwriteType } = require("discord.js");
const { controlChannelMessage } = require("../../../util/embeds");
const { setDbControlChannel } = require("../../../util/controlChannel");

/**
 * @type {import("discord.js").PermissionResolvable}
 */
const CONTROL_CHANNEL_PERMISSIONS = [
	"ViewChannel",
	"SendMessages",
	"ManageMessages",
	"EmbedLinks",
	"AttachFiles",
	"ReadMessageHistory",
];

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

			await interaction.deferReply();

			if (!channelName?.length)
				try {
					await setDbControlChannel({guildId, channelId: null, messageId: null});

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
				const createdChannel = await interaction.guild.channels.create({
					name: channelName,
					position: 0,
					reason: "Discord Music Bot Control Channel",
					topic: "Discord Music Bot Control Channel",
					type: ChannelType.GuildText,
					permissionOverwrites: CONTROL_CHANNEL_PERMISSIONS.map((perm) => ({
						allow: perm,
						id: interaction.guild.members.me.id,
						type: OverwriteType.Member,
					})),
				});

				// construct control message
				const msg = controlChannelMessage({ guildId: interaction.guildId });

				const controlMessage = await createdChannel.send(msg);

				await controlMessage.pin("Discord Music Bot Control Message");

				const channelId = createdChannel.id;
				const messageId = controlMessage.id;

				await setDbControlChannel({guildId, channelId, messageId});

				return interaction.editReply(`Control channel set <#${channelId}>!`);
			} catch (e) {
				client.error(e);
				console.error(e);
				if (e.message?.length) return interaction.editReply(e.message);
			}
		}
	);

	baseCommand.setSubCommandBotPermissions(commandName, [
		{
			permission: "ManageChannels",
			message: "creating control channel",
		},
		...CONTROL_CHANNEL_PERMISSIONS.map((perm) => ({
			permission: perm,
			message: "control channel management",
		})),
	]);

	return baseCommand;
};
