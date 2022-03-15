const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const command = new SlashCommand()
  .setName("youtube")
  .setDescription("Starts a YouTube Together session")
  .setRun(async (client, interaction, options) => {
    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "You need to join voice channel first before you can use this command"
        );
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
    }

    

    const invite = await client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, `youtube` )
      const Embed = new MessageEmbed()
        .setAuthor({
          name: "YouTube Together",
          iconURL: "https://cdn.darrennathanael.com/assets/discord/youtube.png",
        })
        //.setAuthor(`YouTube Together`, "https://darrennathanael.com/cdn/youtube.png")
        .setColor(client.config.embedColor)
        .setDescription(`Using **YouTube Together** you can watch YouTube with your friends in a Voice Channel. Click *Join YouTube Together* to join in!
      
      __**[Join YouTube Together](${invite.code})**__

      ⚠ **Note:** This only works in Desktop`);
      return interaction.reply({ embeds: [Embed] });
    });


module.exports = command;
