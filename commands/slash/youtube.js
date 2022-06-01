const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const { DiscordTogether } = require('discord-together');

const command = new SlashCommand()
.setName('youtube')
.setDescription('Starts a youtube together activity')
.setRun(async (client, interaction, options) => {
    client.discordTogether = new DiscordTogether(client);
    if (
        !interaction.member.voice.channel
        ) {
        await interaction.reply(`Please join a voice channel first!`)
    } else {
        client.discordTogether.createTogetherCode(interaction.guild.members.cache.get(interaction.member.user.id).voice.channelId, 'youtube').then(async invite => {
            const embed = new MessageEmbed()
            .setAuthor({
                name: "YouTube Together",
                iconURL: "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
            })
            .setColor(client.config.embedColor)
            .setDescription(`Using  **YouTube Together** you can watch YouTube with your friends in a Voice Channel. Click *Join YouTube Together* to join in!
            __**[Join YouTube Together](${invite.code})**__
            ⚠ **Note:** This only works in Desktop`)
            return interaction.reply({embeds: [embed]})
        })
    }
    
  
})

module.exports = command;
