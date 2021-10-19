/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */
module.exports = (client, interaction) => {
    if(interaction.isCommand()){
        let command = client.commands.find(cmd => cmd.Command.SlashCommand.command.name == interaction.commandName)
        if(!command || !command.Command.SlashCommand.run)return interaction.reply("Sorry the command you used doesn't have any run function")
        command.Command.SlashCommand.run(client, interaction, interaction.options)
        return
    }

    if(interaction.isContextMenu()){
        let command = client.commands.find(cmd => cmd.Command.ContextMenu.command.name == interaction.commandName)
        if(!command || !command.Command.ContextMenu.run)return interaction.reply("Sorry the command you used doesn't have any run function")
        command.Command.ContextMenu.run(client, interaction, interaction.options)
        return
    }
}