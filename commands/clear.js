const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clears the server queue",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("There are no songs in the queue to clear!");
    player.queue.clear();
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription("✅ | **Cleared the queue!**");
    await message.channel.send(embed);
  },

  SlashCommand: {
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return interaction.send("❌ | **Nothing is playing right now...**");

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return interaction.send("There are no songs in the queue to clear!");
      player.queue.clear();
      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("✅ | **Cleared the queue!**");
      await interaction.send(embed);
    },
  },
};
