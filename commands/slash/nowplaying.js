const { MessageEmbed } = require("discord.js");
const escapeMarkdown = require('discord.js').Util.escapeMarkdown;
const SlashCommand = require("../../lib/SlashCommand");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("nowplaying")
	.setDescription("Shows the song currently playing in the voice channel.")
	.setRun(async (client, interaction, options) => {
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
						.setDescription("The bot isn't in a channel."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.playing) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There's nothing playing."),
				],
				ephemeral: true,
			});
		}
		
		const song = player.queue.current;
        var title = escapeMarkdown(song.title)
        var title = title.replace(/\]/g,"")
        var title = title.replace(/\[/g,"")
		const embed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({ name: "Now Playing", iconURL: client.config.iconURL })
			// show who requested the song via setField, also show the duration of the song
			.setFields([
				{
					name: "Requested by",
					value: `<@${ song.requester.id }>`,
					inline: true,
				},
				// show duration, if live show live
				{
					name: "Duration",
					value: song.isStream
						? `\`LIVE\``
						: `\`${ prettyMilliseconds(player.position, {
							secondsDecimalDigits: 0,
						}) } / ${ prettyMilliseconds(song.duration, {
							secondsDecimalDigits: 0,
						}) }\``,
					inline: true,
				},
			])
			// show the thumbnail of the song using displayThumbnail("maxresdefault")
			.setThumbnail(song.displayThumbnail("maxresdefault"))
			// show the title of the song and link to it
			.setDescription(`[${ title }](${ song.uri })`);
		return interaction.reply({ embeds: [embed] });
	});
module.exports = command;
