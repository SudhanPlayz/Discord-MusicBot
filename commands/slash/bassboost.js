const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("bassboost")
    .setDescription("Set bassboost to current playing track")
    .addStringOption((option) =>
        option
            .setName("options")
            .setDescription("Choose available options")
            .setRequired(true)
            .addChoice("High", 'high')
            .addChoice("Medium", 'medium')
            .addChoice("Low", "low")
            .addChoice("Off", 'off'))

    .setRun(async (client, interaction, options) => {

        const args = interaction.options.getString("options");

        let player = client.manager.players.get(interaction.guild.id);

        if (!player) {
            const QueueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | There's nothing playing in the queue")
            return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
        }

        if (!interaction.member.voice.channel) {
            const JoinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | You have to join voice channel first before you can use this command")
            return interaction.reply({ embeds: [JoinEmbed], ephemeral: true })
        }

        if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
            const SameEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | You must be in the same voice channel as me first before you can use this command")
            return interaction.reply({ embeds: [SameEmbed], ephemeral: true })
        }

        let takemethere = new MessageEmbed()
            .setColor(client.config.embedColor)

        if (args == 'high') {
            var bands = [
                { band: 0, gain: 0.35 },
            ];
            player.setEQ(...bands);
            takemethere.setDescription(`✅ | **Set the bassboost level to** \`high\``);
        } else if (args == 'medium') {
            var bands = [
                { band: 0, gain: 0.3 },
            ];
            player.setEQ(...bands);
            takemethere.setDescription(`✅ | **Set the bassboost level to** \`medium\``);
        } else if (args == 'low') {
            var bands = [
                { band: 0, gain: 0.2 },
            ];
            player.setEQ(...bands);
            takemethere.setDescription(`✅ | **Set the bassboost level to** \`low\``);
        } else if (args == 'off') {
            player.clearEQ();
            takemethere.setDescription(`✅ | **Set the bassboost level to** \`none\``);
        }

        return interaction.reply({ embeds: [takemethere] })

    });

module.exports = command;
