const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("volume")
	.setDescription("Change the volume of the current song.")
	.addNumberOption((option) =>
		option
			.setName("amount")
			.setDescription("Amount of volume you want to change. Ex: 10")
			.setRequired(false),
	)
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
						.setDescription("There is no music playing."),
				],
				ephemeral: true,
			});
		}
		
		let vol = interaction.options.getNumber("amount");
		let volumeErrorEmbed = new MessageEmbed().setColor("RED");
		const maxVolume = client.config.maxVolume;

		if (!vol) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`:loud_sound: | Current volume **${ player.volume }**`,
						),
				],
			});
		}

		if (vol > maxVolume) {
			return interaction.reply({
				embeds: [
					volumeErrorEmbed
						.setDescription(
							`**Volume cannot exceed ${ maxVolume }%**`,
						),
				],
			});
		}

		if (vol < 1) {
			return interaction.reply({
				embeds: [
					volumeErrorEmbed
						.setDescription(
							`**Volume cannot be less than 1%**`,
						),
				],
			});
		}
		
		player.setVolume(vol);
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						`:loud_sound: | Successfully set volume to **${ player.volume }**`,
					),
			],
		});
	});

module.exports = command;
