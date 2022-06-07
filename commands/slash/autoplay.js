const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autoplay")
  .setDescription("Autoplay music toggle")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You need to join voice channel first before you can use this command.**"
        );
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
    }

    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      const sameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You must be in the same voice channel as me.**"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }
    if (!player) {
      return interaction.reply({
        embeds: [
          client.ErrorEmbed(
            "Please add track to the queue to activate autoplay"
          ),
        ],
      });
    }

    await interaction.deferReply();

    const autoplay = player.get("autoplay");

    if (autoplay === false) {
      const identifier = player.queue.current.identifier;

      player.set("autoplay", true);
      player.set("requester", interaction.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      res = await player.search(search, interaction.user);
      player.queue.add(res.tracks[1]);

      let embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`Autoplay is now \`enabled\``);

      return interaction.editReply({ embeds: [embed] });
    } else {
      player.set("autoplay", false);
      player.queue.clear();

      let embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`Autoplay is now \`disabled\``);

      return interaction.editReply({ embeds: [embed] });
    }
  });

module.exports = command;
