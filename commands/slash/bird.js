const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const fetchData = require("../utils/utils.js");

const command = new SlashCommand()
  .setName("bird")
  .setDescription("Get a random image/fact of borb")
  .setRun(async (client, interaction) => {
    const data = await fetchData("https://some-random-api.com/animal/bird");

    const statsEmbed = new MessageEmbed()
      .setTitle("🦉")
      .setImage(data.image)
      .setDescription(`Fact: ${data.fact}`)
      .setFooter({ text: "BORB!" });
    return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
  });

module.exports = command;
