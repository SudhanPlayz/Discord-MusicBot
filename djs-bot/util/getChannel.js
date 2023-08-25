const Bot = require("../lib/Bot");
const { redEmbed } = require("../util/embeds");

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
		let errorStr;


		if (!interaction.member.voice.channel) {
			errorStr = "You must be in a voice channel to use this command!";
		}
		else if (
			interaction.guild.members.cache.get(client.user.id).voice.channel &&
			!interaction.guild.members.cache
			.get(client.user.id)
			.voice.channel.equals(interaction.member.voice.channel)
		) {
			errorStr =
				"You must be in the same voice channel as me to use this command!";
		}
		else if (!interaction.member.voice.channel.joinable) {
			errorStr = "I don't have enough permission to join your voice channel!";
		}


		if (errorStr) {
			await interaction.reply({
				embeds: [redEmbed({ desc: errorStr })],
				...options,
			});

			return resolve(false);
		}

		resolve(interaction.member.voice.channel);
	});
};
