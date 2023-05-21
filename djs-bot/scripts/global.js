const { REST } = require("@discordjs/rest");
const getConfig = require("../util/getConfig");
const { Routes } = require("discord-api-types/v10");
const { getCommands } = require("../util/getDirs");

// Posts slash commands to all guilds containing the bot
// Docs: https://discordjs.guide/interactions/slash-commands.html#global-commands
// https://github.com/discordjs/discord.js/tree/main/packages/rest
// https://github.com/discordjs/discord-api-types/
(async () => {
	const config = await getConfig();
	const rest = new REST({ version: "10" }).setToken(config.token);
	const commands = await getCommands().then((cmds) => {
		return cmds.slash;
	});
	
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put( Routes.applicationCommands(config.clientId), { body: commands },);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();