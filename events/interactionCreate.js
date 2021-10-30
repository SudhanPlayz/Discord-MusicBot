const Controller = require("../util/Controller");

/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */
module.exports = (client, interaction) => {
  if (interaction.isCommand()) {
    let command = client.slashCommands.find(
      (x) => x.name == interaction.commandName
    );
    if (!command || !command.run)
      return interaction.reply(
        "Sorry the command you used doesn't have any run function"
      );
    command.run(client, interaction, interaction.options);
    return;
  }

  if (interaction.isContextMenu()) {
    let command = client.contextCommands.find(
      (x) => x.command.name == interaction.commandName
    );
    if (!command || !command.run)
      return interaction.reply(
        "Sorry the command you used doesn't have any run function"
      );
    command.run(client, interaction, interaction.options);
    return;
  }

  if (interaction.isButton()) {
    if (interaction.customId.startsWith("controller"))
      Controller(client, interaction);
  }
};
