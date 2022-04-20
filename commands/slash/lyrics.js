const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const fetch = require("node-fetch");

const command = new SlashCommand()
  .setName("lyrics")
  .setDescription("Shows lyrics of a song")
  // get user input
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The song to get lyrics for")
      .setRequired(false)
  )
  .setRun(async (client, interaction, options) => {
	await interaction.deferReply().catch((_) => {});
	
	await interaction.editReply({
		embeds: [client.Embed(":mag_right: **Searching...**")],
	});
	
	const args = interaction.options.getString("song");
	
	let player = client.manager.players.get(interaction.guild.id);
	
	if (!args && !player)
	return interaction.editReply({
		embeds: [client.ErrorEmbed("❌ | **There's nothing playing**")],
	});
	
	// if no input, search for the current song. if no song console.log("No song input");
	let search = args ? args : player.queue.current.title;
	let url = `https://api.darrennathanael.com/lyrics?song=${search}`;
	
	
	// get the lyrics 
	let lyrics = await fetch(url).then((res) => res.json());
	
	// if the status is not ok then send error embed and return	
	if (lyrics.response !== 200) {
		let failEmbed = new MessageEmbed()
		.setColor("RED")
		.setDescription(`❌ | No lyrics found for ${search}! Please try again.`);
		return interaction.editReply({ embeds: [failEmbed] });
	}
	
	let text = lyrics.lyrics;
	
	// check for pagination, if needed construct appropriate components, initialize first string to displate on page [0]
	if(text.length > 4090){
		text = text.substring(0, 4090) + "...";
		let lyricsEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`${lyrics.full_title}`)
			.setURL(lyrics.url)
			.setThumbnail(lyrics.thumbnail)
			.setDescription(text);

		let maxPages = Math.ceil(lyrics.lyrics.length / 4090);

		
		// default page
		let pageNo = 0;
		
		
		// Construction of the buttons for the embed in case pagination is needed
		const getButtons = (pageNo) => {
			return new MessageActionRow().addComponents(
				new MessageButton()
				.setCustomId("lyrics_pag_but_2_app")
				.setEmoji("◀️")
				.setStyle("PRIMARY")
				.setDisabled(pageNo == 0),
				new MessageButton()
				.setCustomId("lyrics_pag_but_1_app")
				.setEmoji("▶️")
				.setStyle("PRIMARY")
				.setDisabled(pageNo == (maxPages - 1)),
			);
		};

		const tempMsg = await interaction.editReply({ embeds: [lyricsEmbed], components: [getButtons(pageNo)], fetchReply: true });
		const collector = tempMsg.createMessageComponentCollector({ time: 600000, componentType: "BUTTON" });
	
		collector.on("collect", async (iter) => {
			if (iter.customId === "lyrics_pag_but_1_app") {
				pageNo++;
			} else if (iter.customId === "lyrics_pag_but_2_app") {
				pageNo--;
			}
			
			text = lyrics.lyrics.substring(pageNo * 4090, (pageNo * 4090) + 4090);
			
			lyricsEmbed.setDescription(text);
			
			await iter.update({ embeds: [lyricsEmbed], components: [getButtons(pageNo)], fetchReply: true });
		});
	} else {
		return interaction.editReply({embeds: [new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`${lyrics.full_title}`)
			.setURL(lyrics.url)
			.setThumbnail(lyrics.thumbnail)
			.setDescription(text)
		]});
	}
});

module.exports = command;	
