const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");
const playerUtil = require("../../util/player");

const command = new SlashCommand()
	.setName("stop")
	.setDescription("Stops whatever the bot is playing and leaves the voice channel\n(This command will clear the queue)")
	
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
						.setDescription("I'm not in a channel."),
				],
				ephemeral: true,
			});
		}
		
		const status = playerUtil.stop(player);
		
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setDescription(`:wave: | **Bye Bye!**`),
			],
		});
	});

module.exports = command;
