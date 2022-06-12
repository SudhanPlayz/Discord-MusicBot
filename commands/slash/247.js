const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("247")
  .setDescription("toggles 24/7")
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let player;
    if (client.manager)
      player = client.manager.players.get(interaction.guild.id);
    else
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });

    if (!player) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("There's nothing to play 24/7."),
        ],
        ephemeral: true,
      });
    }

    let twentyFourSevenEmbed = new MessageEmbed().setColor(
      client.config.embedColor
    );
    const twentyFourSeven = player.get("twentyFourSeven");

    if (!player.twentyFourSeven || player.twentyFourSeven === false) {
      player.set("twentyFourSeven", true);
    } else {
      player.set("twentyFourSeven", false);
    }

    twentyFourSevenEmbed.setDescription(
      `✅ | **24/7 mode is \`${!player.twentyFourSeven ? "ON" : "OFF"}**\``
    );
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "24/7"
      )}] has been [${colors.blue(
        !twentyFourSeven ? "ENABLED" : "DISABLED"
      )}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return interaction.reply({ embeds: [twentyFourSevenEmbed] });
  });
module.exports = command;
// check above message, it is a little bit confusing. and erros are not handled. probably should be fixed.
// ok use catch ez kom  follow meh ;_;
// the above message meaning error, if it cant find it or take too long the bot crashed
// play commanddddd, if timeout or takes 1000 years to find song it crashed
// OKIE, leave the comment here for idk
