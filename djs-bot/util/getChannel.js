const Bot = require("../lib/Bot");
const { MessageEmbed } = require("../lib/Embed");

// Module checks if you meet the channel requirements to use music commands
/**
 * 
 * @param {Bot} client 
 * @param {import("discord.js").Interaction} interaction 
 * @param {import("discord.js").InteractionReplyOptions} options
 * @returns {Promise<import("discord.js").VoiceBasedChannel>}
 */
module.exports = async (client, interaction, options = {}) => {
	return new Promise(async (resolve) => {
		if (!interaction.member.voice.channel) {
			await interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("Red")
					.setDescription("You must be in a voice channel to use this command!"),
				],
				...options,
			});
			return resolve(false);
		}
		if (interaction.guild.members.cache.get(client.user.id).voice.channel && !interaction.guild.members.cache.get(client.user.id).voice.channel.equals(interaction.member.voice.channel)) {
			await interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("Red")
					.setDescription("You must be in the same voice channel as me to use this command!"),
				],
				...options,
			});
			return resolve(false);
		}
		if (!interaction.member.voice.channel.joinable) {
			await interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("Red")
					.setDescription("I don't have enough permission to join your voice channel!"),
				],
				...options,
			});
			return resolve(false);
		}
		resolve(interaction.member.voice.channel);
	});
};
