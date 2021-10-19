const {
  SlashCommandBuilder,
  SlashCommandUserOption,
} = require("@discordjs/builders");

module.exports = {
  command: new SlashCommandBuilder()
    .setName(Properties.name)
    .setDescription(Properties.description)
    .addUserOption(
      new SlashCommandUserOption()
        .setRequired(true)
        .setName("user")
        .setDescription("The user who you wanted to tell hello")
    ),

  /**
   * This function will handle slash command interaction
   * @param {import("../../lib/DiscordMusicBot")} client
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").CommandInteractionOptionResolver} options
   */
  run: (client, interaction, options) => {
    interaction.reply(`<@${options.getUser("user", true).id}>, Hello!`);
  },
};
