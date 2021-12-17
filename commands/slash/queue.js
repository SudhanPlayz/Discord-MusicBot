const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const prettyMilliseconds = require("pretty-ms");

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
      const song = player.queue.current;
      const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        // show icon from url in botconfig
        .setTitle("Now playing ♪", client.config.iconURL)
        // show who requested the song via setField, also show the duration of the song
        .setFields([
          {
            name: "Requested by",
            // show who requested the song mentioned id
            value: `<@${song.requester.id}>`,
            inline: true,
          },
          // show duration if live show live
          {
            name: "Duration",
            value: song.isStream
              ? `\`LIVE\``
              : `${prettyMilliseconds(song.duration, {
                  secondsDecimalDigits: 0,
                })}`,
            inline: true,
          },
        ])
        // show the thumbnail of the song using displayThumbnail("maxresdefault")
        .setThumbnail(song.displayThumbnail("maxresdefault"))
        // show the title of the song and link to it
        .setDescription(`[${song.title}](${song.uri})`);
      return interaction.reply({ embeds: [embed] });
    }
    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle("Queue", client.config.iconURL)
      .setDescription(
        queue
          .map((song, index) => `${index + 1}. [${song.title}](${song.uri})`)
          .join("\n")
      )
      .setFooter(`there are ${queue.length} songs in queue`);
    return interaction.reply({ embeds: [embed] });
  });

module.exports = command;
