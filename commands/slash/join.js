const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("join")
  .setDescription("Joins the voice channel")
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    let node = await client.getLavalink(client);
    if (!node)
      return interaction.reply({
        embeds: [client.ErrorEmbed("**Lavalink node not connected**")],
      });

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      player = client.createPlayer(interaction.channel, channel);
      player.connect(true);
    }

    if (channel.id !== player.voiceChannel) {
      player.setVoiceChannel(channel.id);
      player.connect();
    }

    interaction.reply({
      embeds: [
        client.Embed(`:thumbsup: | **Successfully joined <#${channel.id}>!**`),
      ],
    });
  });

module.exports = command;
