const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("queue")
  .setDescription("Shows the current queue")
  .setRun(async (client, interaction, options) => {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("**There's nothing playing**")],
      });
      // check current queue for the guild
    }
    const queue = player.queue;
    if (queue.length === 0) {
        return interaction.reply({
            embeds: [client.ErrorEmbed("**There's nothing in the queue**")],
        });
    }
    const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle("Server Queue")
        .setDescription(queue.map((song, index) => `${index + 1}. [${song.title}](${song.uri})`).join("\n"))
        .setFooter(`there are ${queue.length} songs in queue`);
    return interaction.reply({ embeds: [embed] });
    });

module.exports = command;
