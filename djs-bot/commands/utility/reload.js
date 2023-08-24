const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "reload",
	category: "utility",
	usage: "/reload",
	description: "Reload all slash commands (This is a debug command available only to the developer of the bot)",
	ownerOnly: true,
	run: async (client, interaction) => {
		try {
			const CommandSub = fs.readdirSync("./commands") // Relative Path: "../commands"
			const CommandsDir = path.join(__dirname, "..");
			for (const category of CommandSub) {
				const commandFiles = fs
				.readdirSync(`./commands/${category}`)
				.filter((file) => file.endsWith(".js"));
				for (const file of commandFiles) {
					let commandPath = (`${CommandsDir}/${category}/${file}`).replace(/\\/g, '/');
					delete require.cache[require.resolve(commandPath)];
					const command = require(commandPath);
					if (!command || !command.run || !command.name) {
						return client.error(`Unable to load command: ${file} does not have a valid command with run function or name`);
					}
					client.slash.set(command.name, command);
				}
			}
			
			const commandsSize = `Reloaded ${client.slash.size} Commands.`;
			client.info(commandsSize + `\nIn: ${interaction.member.guild.name} - ${interaction.member.guild.id}\nOn shard: ${interaction.member.guild.shardId}`);
			return interaction.reply({
				embeds: [new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setDescription(commandsSize)
					.setFooter({text: `${client.user.username} was reloaded by ${interaction.user.username}`})
					.setTimestamp(),
				], 
				ephemeral: true
			});
		} catch (err) {
			client.error(err + `\nIn: ${interaction.member.guild.name} - ${interaction.member.guild.id}\n On shard: ${interaction.member.guild.shardId}`);
			console.log(err);
			return interaction.reply({ 
				embeds: [new EmbedBuilder().setColor("Red")
				.setDescription("OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!")
				.setFooter({text: "In short... I don't know what happened... But you can ask a bot dev to look into it :D"})], 
				ephemeral: true
			})
		}
	}
}