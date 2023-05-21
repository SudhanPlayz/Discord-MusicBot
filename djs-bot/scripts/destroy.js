const { rl } = require("../util/common");
const { REST } = require("@discordjs/rest");
const getConfig = require("../util/getConfig");
const { Routes } = require("discord-api-types/v10");

// Removes all slash commands from a given guild (shell command `node "./deploy/destroy"`)
// Basically a reverse `guild.js`, instead of 'put' it's 'delete' iykyk
// https://github.com/discordjs/discord.js/tree/main/packages/rest
// https://github.com/discordjs/discord-api-types/
(async () => {
	const config = await getConfig();
	const rest = new REST({ version: "10" }).setToken(config.token);
	
	rl.question("Enter the guild id you want to delete commands in: ", async (guild) => {
		console.log("Bot has started to delete commands...");
		let commands = await rest.get(Routes.applicationGuildCommands(config.clientId, guild));
		for (cmd of commands) {
			await rest.delete(Routes.applicationGuildCommand(config.clientId, guild, cmd.id)).catch(console.log);
			console.log(`Deleted command: ${cmd.name}`);
		}
		if (commands.length === 0) console.log("No commands need to be deleted");
		return rl.close;
	});
})();
