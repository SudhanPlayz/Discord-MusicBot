const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
	.setName("loopq")
	.setDescription("Loop the current song queue")
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
						.setDescription("There is no music playing."),
				],
				ephemeral: true,
			});
		}
		
		if (player.setQueueRepeat(!player.queueRepeat)) {
			;
		}
		const queueRepeat = player.queueRepeat? "enabled" : "disabled";
		
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setDescription(
						`:thumbsup: | **Loop queue is now \`${ queueRepeat }\`**`,
					),
			],
		});
	});

module.exports = command;
