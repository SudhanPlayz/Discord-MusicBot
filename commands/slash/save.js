const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("save")
	.setDescription("Saves current song to your DM's")
	.setRun(async (client, interaction) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There is no music playing right now."),
				],
				ephemeral: true,
			});
		}
		
		const sendtoDmEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({
				name: "Saved track",
				iconURL: `${ interaction.user.displayAvatarURL({ dynamic: true }) }`,
			})
			.setDescription(
				`**Saved [${ player.queue.current.title }](${ player.queue.current.uri }) to your DM**`,
			)
			.addFields(
				{
					name: "Track Duration",
					value: `\`${ prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true,
					}) }\``,
					inline: true,
				},
				{
					name: "Track Author",
					value: `\`${ player.queue.current.author }\``,
					inline: true,
				},
				{
					name: "Requested Guild",
					value: `\`${ interaction.guild }\``,
					inline: true,
				},
			);
		
		interaction.user.send({ embeds: [sendtoDmEmbed] });
		
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						"Please check your **DMs**. If you didn't receive any message from me please make sure your **DMs** are open",
					),
			],
			ephemeral: true,
		});
	});

module.exports = command;
