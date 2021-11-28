const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Invite me to your server")
  .setRun(async (client, interaction, options) => {
    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`Invite me to your server`)
      .setDescription(
        `You can invite me to your server by clicking [here](https://discord.com/oauth2/authorize?client_id=${client.config.clientId}&permissions=${client.config.permissions}&scope=bot%20applications.commands)`
      );
    return interaction.reply({ embeds: [embed] });
  });
module.exports = command;
