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
    await interaction.reply({
      embeds: [client.Embed(":mag_right: **Searching...**")],
    });

    const args = interaction.options.getString("song");

    let player = client.manager.players.get(interaction.guild.id);

    if (!args && !player)
      return interaction.editReply({
        embeds: [client.ErrorEmbed("**There's nothing playing**")],
      });

    // if no input, search for the current song. if no song console.log("No song input");
    let search = args ? args : player.queue.current.title;
    let url = `https://api.darrennathanael.com/lyrics?song=${search}`;
    
    
    // get the lyrics 
    let lyrics = await fetch(url).then((res) => res.json());
	if(lyrics.lyrics.length > 4096){
		var text = lyrics.lyrics.substring(0, 4090) + '...';
	}

    // if the status is ok then send the embed
    if (lyrics.response == 200) {
      let lyricsEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`${lyrics.full_title}`)
        .setURL(lyrics.url)
        .setThumbnail(lyrics.thumbnail)
        .setDescription(text);
      return interaction.editReply({ embeds: [lyricsEmbed] });
    } else if (lyrics.response !== 200) {
      let failEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`❌ | No lyrics found for ${search}! Please try again.`);
      return interaction.editReply({ embeds: [failEmbed] });
    }
  });

module.exports = command;
