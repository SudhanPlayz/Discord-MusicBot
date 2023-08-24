const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Invite me to your server")
  .setRun(async (client, interaction, options) => {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle(`Invite me to your server!`),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Invite me")
            .setStyle(ButtonStyle.Link)
            .setURL(
              client.getInviteLink(),
            )
        ),
      ],
    });
  });
module.exports = command;
