/**
 * 
 * @param {import("../lib/DiscordMusicBot")} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 */
module.exports = async (client, interaction) => {
    let guild = client.guilds.cache.get(interaction.customId.split(":")[1])
    let property = interaction.customId.split(":")[2]
    let player = client.manager.get(guild.id)

    if(property === "LowVolume"){
        player.setVolume(player.volume-10)
        interaction.reply({ embeds: [ client.Embed("Successfully set server volume to "+player.volume) ] })
    }
}