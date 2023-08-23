const { rl } = require("../util/common");
const { REST } = require("@discordjs/rest");
const getConfig = require("../util/getConfig");
const { Routes } = require("discord-api-types/v10");
const Bot = require("../lib/Bot");

Bot.setNoBoot(true);

const { getClient } = require("../bot");

// Posts slash commands to a given guild containing the bot
// Docs: https://discordjs.guide/interactions/slash-commands.html#guild-commands
// https://github.com/discordjs/discord.js/tree/main/packages/rest
// https://github.com/discordjs/discord-api-types/
(async () => {
	const config = await getConfig();
	const rest = new REST({ version: "10" }).setToken(config.token);
	const commands = getClient().slash.map(slash => slash);
	
	rl.question("Enter the guild id you wanted to deploy commands: ", async (guild) => {
		console.log("Deploying commands to guild...");
		await rest.put(Routes.applicationGuildCommands(config.clientId, guild), { 
			body: commands, 
		}).catch(console.log);
		console.log("Successfully deployed commands!");
		rl.close();
	});
})();
