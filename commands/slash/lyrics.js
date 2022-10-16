const SlashCommand = require("../../lib/SlashCommand");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const api = require('lyrics-searcher-musixmatch').default

const command = new SlashCommand()
	.setName("lyrics")
	.setDescription("Get the lyrics of a song")
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("The song to get lyrics for")
			.setRequired(false),
	)
	.setRun(async (client, interaction, options) => {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("🔎 **Searching...**"),
			],
		});
		
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
		
		const args = interaction.options.getString("song");
		if (!args && !player) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There's nothing playing"),
				],
			});
		}
		
		let search = args? args : player.queue.current.title;
        api(search).then((lyrics) => {
		let text = lyrics.lyrics
		const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tipsbutton')
					.setLabel('Tips')
					.setEmoji(`📌`)
					.setStyle('SECONDARY'),
				new MessageButton()
					.setLabel('Source')
					.setURL(lyrics.info.track.shareUrl)
					.setStyle('LINK'),
			);
		
		let lyricsEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`${ lyrics.info.track.name }`)
					.setURL(lyrics.info.track.shareUrl)
					.setThumbnail(lyrics.info.track.albumCoverart350x350)
                    .setFooter({ text: 'Lyrics provided by MusixMatch.', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Musixmatch_logo_icon_only.svg/480px-Musixmatch_logo_icon_only.svg.png' })
					.setDescription(text);
		
		if (text.length > 4096) {
				text = text.substring(0, 4050) + "\n\n[...]";
				lyricsEmbed
					.setDescription(text + `\nTruncated, the lyrics were too long.`)
			}

		return interaction.editReply({ 
				embeds: [lyricsEmbed],
				components: [button],
			
			});
		
		}) 
		.catch((err) => {	
		if (err.message == `No lyrics found!`) {
			const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
				    .setEmoji(`📌`)
				    .setCustomId('tipsbutton')
					.setLabel('Tips')
					.setStyle('SECONDARY'),
			);	

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription(
						`❌ | No lyrics found for ${ search }!\nMake sure you typed in your search correctly.`,
					),
			],
			components: [button],
		});
	} else {
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription(
						`❌ | Unknown error has been detected, please check your console.`,
					),
			],
		});
	};
});

const collector = interaction.channel.createMessageComponentCollector({time: 1000 * 3600 });

collector.on('collect', async i => {
	if (i.customId === 'tipsbutton') {
		await i.deferUpdate();
		await i.followUp({ 			
		embeds: [
			new MessageEmbed()
			    .setTitle(`Lyrics Tips`)
			    .setColor(client.config.embedColor)
				.setDescription(
					`Here is some tips to get your song lyrics correctly \n\n1. Try to add Artist name in front of the song name.\n2. Try to put the song name in the lyrics search box manually using your keyboard.\n3. Avoid using non english language when searching song lyrics, except the song itself doesnt use english language.`,
				),
		], ephemeral: true, components: [] });
	    };
    });
});

module.exports = command;
