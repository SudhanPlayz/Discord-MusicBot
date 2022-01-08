// const { Manager } = require("erela.js/structures/Manager");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("play")
  .setDescription("Play music in the voice channel")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Search string to search the music")
      .setRequired(true)
  )
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let node = await client.getLavalink(client);
    if (!node) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("Lavalink node is not connected")],
      });
    }
    let query = options.getString("query", true);
    let player = client.createPlayer(interaction.channel, channel);
    if (player.state != "CONNECTED") {
      player.connect();
    }
    // TODO: auto join stage channel.

    await interaction.reply({
      embeds: [client.Embed(":mag_right: **Searching...**")],
    });

    let res = await player.search(query, interaction.user).catch((err) => {
      client.error(err);
      return {
        loadType: "LOAD_FAILED",
      };
    });

    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();
      return interaction
        .editReply({
          embeds: [client.ErrorEmbed("There was an error while searching")],
        })
        .catch(this.warn);
    }

    if (res.loadType === "NO_MATCHES") {
      if (!player.queue.current) player.destroy();
      return interaction
        .editReply({
          embeds: [client.ErrorEmbed("No results were found")],
        })
        .catch(this.warn);
    }

    if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      let embed = client
        .Embed()
        .setAuthor({ name: "Added to queue", iconURL: client.config.iconURL })
        //.setAuthor("Added to queue", client.config.iconURL) Deprecated soon
        .setDescription(
          `[${res.tracks[0].title}](${res.tracks[0].uri})` || "No Title"
        )
        .setURL(res.tracks[0].uri)
        .addField("Author", res.tracks[0].author, true)
        .addField(
          "Duration",
          res.tracks[0].isStream
            ? `\`LIVE\``
            : `\`${client.ms(res.tracks[0].duration, {
                colonNotation: true,
              })}\``,
          true
        );
      try {
        embed.setThumbnail(res.tracks[0].displayThumbnail("maxresdefault"));
      } catch (err) {
        embed.setThumbnail(res.tracks[0].thumbnail);
      }
      if (player.queue.totalSize > 1)
        embed.addField("Position in queue", `${player.queue.size - 0}`, true);
      return interaction.editReply({ embeds: [embed] }).catch(this.warn);
    }

    if (res.loadType === "PLAYLIST_LOADED") {
      player.queue.add(res.tracks);
      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      )
        player.play();
      let embed = client
        .Embed()
        .setAuthor({
          name: "Playlist added to queue",
          iconURL: client.config.iconURL,
        })
        //.setAuthor("Playlist added to queue", client.config.iconURL)
        .setThumbnail(res.tracks[0].thumbnail)
        .setDescription(`[${res.playlist.name}](${query})`)
        .addField("Enqueued", `\`${res.tracks.length}\` songs`, false)
        .addField(
          "Playlist duration",
          `\`${client.ms(res.playlist.duration, {
            colonNotation: true,
          })}\``,
          false
        );
      return interaction.editReply({ embeds: [embed] }).catch(this.warn);
    }
  });

module.exports = command;
