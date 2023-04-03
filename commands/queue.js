const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");
let d;

module.exports = {
  name: "queue",
  description: "Shows all currently enqueued songs",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor("Currently playing", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `[${player.queue.current.title}](${player.queue.current.uri})`
        )
        .addField("Requested by", `${player.queue.current.requester}`, true)
        .setThumbnail(player.queue.current.displayThumbnail());

      // Check if the duration matches the duration of a livestream
      if (player.queue.current.duration == 9223372036854776000) {
        QueueEmbed.addField("Duration", `\`Live\``, true);
      } else {
        QueueEmbed.addField(
          "Duration",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
        );
      }

      return message.channel.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map((t) => {
        let d;
        // Check if duration matches duration of livestream
        if (t.duration == 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(t.duration, { colonNotation: true });
        }
        return `\`${t.index + 1}.\` [${t.title}](${
          t.uri
        }) \n\`${d}\` **|** Requested by: ${t.requester}\n`;
      }).join("\n");

      let Embed = new MessageEmbed()
        .setAuthor("Queue", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `**Currently Playing:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
        )
        .addField("Total songs: \n", `\`${player.queue.totalSize - 1}\``, true);

      // Check if duration matches duration of livestream
      if (player.queue.duration >= 9223372036854776000) {
        d = "Live";
      } else {
        d = prettyMilliseconds(player.queue.duration, { colonNotation: true });
      }

      Embed.addField("Total length: \n", `\`${d}\``, true).addField(
        "Requested by:",
        `${player.queue.current.requester}`,
        true
      );

      if (player.queue.current.duration == 9223372036854776000) {
        Embed.addField("Current song duration:", "`Live`");
      } else {
        Embed.addField(
          "Current song duration:",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
        );
      }

      Embed.setThumbnail(player.queue.current.displayThumbnail());

      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
  },
  SlashCommand: {
    /*
    options: [
      {
          name: "page",
          value: "[page]",
          type: 4,
          required: false,
          description: "Enter the page of the queue you would like to view",
      },
  ],
  */
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );

      if (!player.queue || !player.queue.length || player.queue === 0) {
        let QueueEmbed = new MessageEmbed()
          .setAuthor("Currently playing", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField("Requested by", `${player.queue.current.requester}`, true)
          .setThumbnail(player.queue.current.displayThumbnail());
        if (player.queue.current.duration == 9223372036854776000) {
          QueueEmbed.addField("Duration", `\`Live\``, true);
        } else {
          QueueEmbed.addField(
            "Duration",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          );
        }
        return interaction.send(QueueEmbed);
      }

      let Songs = player.queue.map((t, index) => {
        t.index = index;
        return t;
      });

      let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

      let Pages = ChunkedSongs.map((Tracks) => {
        let SongsDescription = Tracks.map((t) => {
          let d;
          // Check if duration matches duration of livestream
          if (t.duration == 9223372036854776000) {
            d = "Live";
          } else {
            d = prettyMilliseconds(t.duration, { colonNotation: true });
          }
          return `\`${t.index + 1}.\` [${t.title}](${
            t.uri
          }) \n\`${d}\` **|** Requested by: ${t.requester}\n`;
        }).join("\n");

        let Embed = new MessageEmbed()
          .setAuthor("Queue", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `**Currently Playing:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
          )
          .addField(
            "Total songs: \n",
            `\`${player.queue.totalSize - 1}\``,
            true
          );

        // Check if duration matches duration of livestream
        if (player.queue.duration >= 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          });
        }

        Embed.addField("Total length: \n", `\`${d}\``, true).addField(
          "Requested by:",
          `${player.queue.current.requester}`,
          true
        );

        if (player.queue.current.duration == 9223372036854776000) {
          Embed.addField("Current song duration:", "`Live`");
        } else {
          Embed.addField(
            "Current song duration:",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``
          );
        }

        Embed.setThumbnail(player.queue.current.displayThumbnail());

        return Embed;
      });

      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);
      else client.Pagination(interaction, Pages);
    },
  },
};
