const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dashboard",
  description: "To see the dashboard!",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["db"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setAuthor(
        "Check The Dashboard Of " + client.user.username + "!",
        client.user.displayAvatarURL()
      )
      .setColor("BLUE")
      .setDescription(
        `You can see my dashboard by clicking [here](${client.botconfig.Website})`
      );
    message.channel.send(embed);
  },
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let embed = new MessageEmbed()
        .setAuthor(
          "Check The Dashboard Of " + client.user.username + "!",
          client.user.displayAvatarURL()
        )
        .setColor("BLUE")
        .setDescription(
          `You can see my dashboard by clicking [here](${client.botconfig.Website})`
        );
      interaction.send(embed);
    },
  },
};


