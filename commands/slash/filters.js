const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("filters")
  .setDescription("add or remove filters")
  .addStringOption((option) =>
    option
      .setName("preset")
      .setDescription("the preset to add")
      .setRequired(true)
      .addChoice("Nightcore", "nightcore")
      .addChoice("BassBoost", "bassboost")
      .addChoice("Vaporwave", "vaporwave")
      .addChoice("Pop", "pop")
      .addChoice("Soft", "soft")
      .addChoice("Treblebass", "treblebass")
      .addChoice("Eight Dimension", "eightD")
      .addChoice("Karaoke", "karaoke")
      .addChoice("Vibrato", "vibrato")
      .addChoice("Tremolo", "tremolo")
      .addChoice("Reset", "off")
  )

  .setRun(async (client, interaction, options) => {
    const args = interaction.options.getString("preset");

    let player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | There is no music playing in this guild!");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | You must be in a voice channel to use this command!"
        );
      return interaction.reply({ embeds: [JoinEmbed], ephemeral: true });
    }

    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      const SameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | You must be in the same voice channel as the bot to use this command!"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    // create a new embed
    let thing = new MessageEmbed().setColor(client.config.embedColor);

    if (args == "nightcore") {
      thing.setDescription("✅ | Nightcore filter is now active!");
      player.nightcore = true;
    } else if (args == "bassboost") {
      thing.setDescription("✅ | BassBoost filter is now on!");
      player.bassboost = true;
    } else if (args == "vaporwave") {
      thing.setDescription("✅ | Vaporwave filter is now on!");
      player.vaporwave = true;
    } else if (args == "pop") {
      thing.setDescription("✅ | Pop filter is now on!");
      player.pop = true;
    } else if (args == "soft") {
      thing.setDescription("✅ | Soft filter is now on!");
      player.soft = true;
    } else if (args == "treblebass") {
      thing.setDescription("✅ | Treblebass filter is now on!");
      player.treblebass = true;
    } else if (args == "eightD") {
      thing.setDescription("✅ | Eight Dimension filter is now on!");
      player.eightD = true;
    } else if (args == "karaoke") {
      thing.setDescription("✅ | Karaoke filter is now on!");
      player.karaoke = true;
    } else if (args == "vibrato") {
      thing.setDescription("✅ | Vibrato filter is now on!");
      player.vibrato = true;
    } else if (args == "tremolo") {
      thing.setDescription("✅ | Tremolo filter is now on!");
      player.tremolo = true;
    } else if (args == "off") {
      thing.setDescription("✅ | EQ has been cleared!");
      player.reset();
    } else {
      thing.setDescription("❌ | Invalid filter!");
    }

    return interaction.reply({ embeds: [thing] });
  });

module.exports = command;
