const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const command = new SlashCommand()
  .setName("games")
  .setDescription("Starts a Game session")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("pick a game to play")
      .setRequired(true)
      .addChoice("poker", "Poker")
      .addChoice("betrayal", "Betrayal")
      .addChoice("fishing", "Fishing")
      .addChoice("chess", "Chess")
      .addChoice("lettertile", "Lettertile")
      .addChoice("wordsnack", "Wordsnack")
      .addChoice("doodlecrew", "Doodlecrew")
      .addChoice("awkword", "Awkword")
      .addChoice("spellcast", "Spellcast")
      .addChoice("checkers", "Checkers")
      .addChoice("puttparty", "Puttparty"))




  .setRun(async (client, interaction, options) => {
   

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "You need to join voice channel first before you can use this command"
        );
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
      
    }
    
    const game = interaction.options.getString('game');
    console.log(game)
      const invite = await client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, game )
      const Embed = new MessageEmbed()
      
        .setAuthor({
          name: interaction.options.getString('game'),
          iconURL: "",
        })
        .setColor(client.config.embedColor)
        .setDescription(`__**[Join ` + interaction.options.getString('game') + 
        `](${invite.code})
        
        **__⚠ **Note:** This only works in Desktop`);


        
      return interaction.reply({ embeds: [Embed] });
    });

module.exports = command;
