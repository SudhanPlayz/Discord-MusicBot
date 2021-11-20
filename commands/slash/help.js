const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("help")
  .setDescription("Shows help commands")
  .setRun(async (client, interaction) => {
    interaction.reply({
      embeds: [
        client.Embed(`You press \`/\` and it shows command, thank me later`),
      ],
    });
  });

module.exports = command;