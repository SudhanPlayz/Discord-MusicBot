const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");
const { clearQueue } = require("../../util/player");

const command = new SlashCommand()
	.setName("clear")
	.setDescription("Clear all tracks from queue")
	.setRun(async (client, interaction, options) => {
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
						.setDescription("Nothing is playing right now."),
				],
				ephemeral: true,
			});
		}

		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			let cembed = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setDescription(
					"❌ | **Invalid, Not enough track to be cleared.**"
				);

			return interaction.reply({ embeds: [cembed], ephemeral: true });
		}

		clearQueue(player);

		let clearEmbed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setDescription(`✅ | **Cleared the queue!**`);

		return interaction.reply({ embeds: [clearEmbed] });
	});

module.exports = command;
