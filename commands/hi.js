const { SlashCommandBuilder, ContextMenuCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders")

//This properties for easy to edit both slash command and context menu's name and description
const Properties = {
    name: "hi",
    description: "Says hi to you"
}

//This command object will handle command's options and running functions
const Command = {
    SlashCommand: {
        command: new SlashCommandBuilder()
        .setName(Properties.name)
        .setDescription(Properties.description)
        .addUserOption(
            new SlashCommandUserOption()
            .setRequired(true)
            .setName("User")
            .setDescription("User who you wanted to tell hello")
        ),

        /**
         * This function will handle slash command interaction
         * @param {import("discord.js").CommandInteraction} interaction 
         * @param {import("discord.js").CommandInteractionOptionResolver} options 
         */
        run: (interaction, options) => {
            interaction.reply(`<@${options.getUser("User", true).id}>, Hello!`)
        }
    },

    ContextCommand: {
        command: new ContextMenuCommandBuilder()
        .setName(Properties.name)
        .setType("USER"),
        
        /**
         * This function will handle context menu interaction
         * @param {import("discord.js").GuildContextMenuInteraction} interaction 
         */
        run: (interaction) => {
            interaction.reply(`<@${interaction.options.getUser("USER").id}>, Hello!`)
        }
    }
}

module.exports = { Properties, Command }