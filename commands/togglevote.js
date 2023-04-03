const voteskip = true;

module.exports = {
  name: "togglevote",
  description: "Toggle voteskip",
  permissions: {
    member: ["ADMINISTRATOR"],
  },
  aliases: ["votes"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, interaction, args, { GuildDB }) => {
    if (voteskip) {
      voteskip = false;
      client.sendTime(interaction, `🔂 \`Disabled\``);
    } else {
      voteskip = true;
      client.sendTime(interaction, `🔂 \`Enabled\``);
    }
  },
};
