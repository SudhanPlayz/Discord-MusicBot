const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");
const { removeTrack } = require("../../util/player");

const command = new SlashCommand()
	.setName("skipto")
	.setDescription("skip to a specific song in the queue")
	.addNumberOption((option) =>
		option
			.setName("number")
			.setDescription("The number of tracks to skipto")
			.setRequired(true)
	)

	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getNumber("number");
		//const duration = player.queue.current.duration

		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}

		let player;
		if (client.manager.Engine) {
			player = client.manager.Engine.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}

		if (!player) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("I'm not in a channel."),
				],
				ephemeral: true,
			});
		}

		await interaction.deferReply();

		const position = Number(args);

		try {
			if (!position || position < 0 || position > player.queue.size) {
				let thing = new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setDescription("❌ | Invalid position!");
				return interaction.editReply({ embeds: [thing] });
			}

			removeTrack(player, 0, position - 1);
			player.stop();

			let thing = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setDescription("✅ | Skipped to position " + position);

			return interaction.editReply({ embeds: [thing] });
		} catch {
			if (position === 1) {
				player.stop();
			}
			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setDescription(
							"✅ | Skipped to position " + position
						),
				],
			});
		}
	});

module.exports = command;
