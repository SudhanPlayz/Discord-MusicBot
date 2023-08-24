const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
	.setName("summon")
	.setDescription("Summons the bot to the channel.")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!interaction.member.voice.channel) {
			const joinEmbed = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setDescription(
					"❌ | **You must be in a voice channel to use this command.**",
				);
			return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
		}
		
		let player = client.manager.Engine.players.get(interaction.guild.id);
		if (!player) {
			player = client.manager.Engine.createPlayer({
				guildId: interaction.guild.id,
				voiceChannel: channel.id,
				textChannel: interaction.channel.id,
			});
			player.connect(true);
		}
		
		if (channel.id !== player.voiceChannel) {
			player.setVoiceChannel(channel.id);
			player.connect();
		}
		
		interaction.reply({
			embeds: [
				new EmbedBuilder().setDescription(`:thumbsup: | **Successfully joined <#${ channel.id }>!**`),
			],
		});
	});

module.exports = command;
