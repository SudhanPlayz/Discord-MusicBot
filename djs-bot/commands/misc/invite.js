const { MessageActionRow, MessageButton, MessageEmbed } = require("../../lib/Embed");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Invite me to your server")
  .setRun(async (client, interaction, options) => {
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setTitle(`Invite me to your server!`),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Invite me")
            .setStyle('Link')
            .setURL(
              client.getInviteLink(),
            )
        ),
      ],
    });
  });
module.exports = command;
