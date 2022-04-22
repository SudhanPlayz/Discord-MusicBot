const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("loopqueue")
  .setDescription("Loop the queue")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("There is no music playing")],
      });
    }
    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(client.config.JoinEmbed);
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
        .setDescription(client.config.SameEmbed);
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }
    if (player.setQueueRepeat(!player.queueRepeat));
    const queueRepeat = player.queueRepeat ? "enabled" : "disabled";

    let loopembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`:thumbsup: | **Loop queue is now \`${queueRepeat}\`**`); //not ediiting because it having contents that require an npm package, known as placeholders in Java
    interaction.reply({ embeds: [loopembed] });
  });

module.exports = command;
