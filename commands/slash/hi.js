const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("hi")
  .setDescription("this is a nice description")
  .setRun((client, interaction, options) => {
    interaction.reply(`<@${options.getUser("user", true).id}>, Hello!`);
  });

module.exports = command;
