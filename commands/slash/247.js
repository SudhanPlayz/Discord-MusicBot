const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("247")
  .setDescription("toggles 24/7")
  .setRun(async (client, interaction, options) => {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("**There's nothing to play 24/7!**")],
      });
    } else if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = client.Embed(`✅ | **24/7 mode is now off.**`);
      return interaction.reply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = client.Embed(`✅ | **24/7 mode is now on.**`);
      return interaction.reply({ embeds: [embed] });
    }
  });
module.exports = command;
// check above message, it is a little bit confusing. and erros are not handled. probably should be fixed.
// ok use catch ez kom  follow meh ;_;
// the above message meaning error, if it cant find it or take too long the bot crashed
// play commanddddd, if timeout or takes 1000 years to find song it crashed
// OKIE, leave the comment here for idk
