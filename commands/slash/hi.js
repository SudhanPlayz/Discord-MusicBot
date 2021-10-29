const SlashCommand = require("../../lib/SlashCommand");
const { SlashCommandUserOption } = require("@discordjs/builders");

const command = new SlashCommand()
  .setName("hi")
  .setDescription("this is a nice description")
  .addUserOption(
    new SlashCommandUserOption()
      .setRequired(true)
      .setName("user")
      .setDescription("The user who you wanted to tell hello")
  )
  .setRun((client, interaction, options) => {
    interaction.reply(`<@${options.getUser("user", true).id}>, Hello!`);
  });

module.exports = command;
