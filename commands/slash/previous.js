const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("previous")
	.setDescription("Go back to the previous song.")
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
						.setDescription("There are no previous songs for this session."),
				],
				ephemeral: true,
			});
		}
		
		let previousSong = player.queue.previous;
		
		if (!previousSong) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There is no previous song in the queue."),
				],
			});
		}
		
		const currentSong = player.queue.current;
		player.play(previousSong);
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						`⏮ | Previous song: **${ previousSong.title }**`,
					),
			],
		});
		
		previousSong = currentSong;
	});

module.exports = command;
