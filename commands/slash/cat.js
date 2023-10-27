const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const fetchData = require("../utils/utils.js");

const command = new SlashCommand()
  .setName("cat")
  .setDescription("Get a  random image/fact of cats")
  .setRun(async (client, interaction) => {
    const data = await fetchData("https://some-random-api.com/animal/cat");

    const statsEmbed = new MessageEmbed()
      .setTitle("🐈")
      .setImage(data.image)
      .setDescription(`Fact: ${data.fact}`)
      .setFooter({ text: "KITTY!" });
    return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
  });

module.exports = command;
