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
    if (!node)
      return interaction.reply({
        embeds: [client.ErrorEmbed("Lavalink node not connected")],
      });

    let query = options.getString("query", true);
    let player = client.createPlayer(interaction.channel, channel);

    if (player.state != "CONNECTED") await player.connect();

    let res = await player.search(query, interaction.user);

    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();
      return interaction.reply({
        embeds: [client.ErrorEmbed("There was an error while searching")],
      });
    }

    if (res.loadType === "NO_MATCHES") {
      if (!player.queue.current) player.destroy();
      return interaction.reply({
        embeds: [client.ErrorEmbed("No results were found")],
      });
    }

    if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      let embed = client
        .Embed()
        .setAuthor("Added to queue", client.config.iconURL)
        .setThumbnail(res.tracks[0].displayThumbnail())
        .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
        .addField("Author", res.tracks[0].author, true)
        .addField(
          "Duration",
          `\`${client.ms(res.tracks[0].duration, {
            colonNotation: true,
          })}\``,
          true
        );
      if (player.queue.totalSize > 1)
        embed.addField("Position in queue", `${player.queue.size - 0}`, true);
      return interaction.reply({ embeds: [embed] });
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
        .setAuthor("Playlist added to queue", client.config.iconURL)
        .setThumbnail(res.tracks[0].displayThumbnail())
        .setDescription(`[${res.playlist.name}](${query})`)
        .addField("Enqueued", `\`${res.tracks.length}\` songs`, false)
        .addField(
          "Playlist duration",
          `\`${client.ms(res.playlist.duration, {
            colonNotation: true,
          })}\``,
          false
        );
      return interaction.reply({ embeds: [embed] });
    }
  });

module.exports = command;
