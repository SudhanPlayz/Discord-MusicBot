const { REST } = require("@discordjs/rest");
const getConfig = require("../util/getConfig");
const { Routes } = require("discord-api-types/v10");
const { writeFile } = require("fs");
const { join } = require("path");
const Bot = require("../lib/Bot");

Bot.setNoBoot(true);

const { getClient } = require("../bot");

// Posts slash commands to all guilds containing the bot
// Docs: https://discordjs.guide/interactions/slash-commands.html#global-commands
// https://github.com/discordjs/discord.js/tree/main/packages/rest
// https://github.com/discordjs/discord-api-types/
(async () => {
	const config = await getConfig();
	const rest = new REST({ version: "10" }).setToken(config.token);
	const commands = getClient().slash.map(slash => slash);

	try {
		console.log("Started refreshing application (/) commands.");
		await rest.put(Routes.applicationCommands(config.clientId), {
			body: commands,
		});
		console.log("Successfully reloaded application (/) commands.");

		writeFile(join(__dirname, "..", "registered-global"), "", (err) => {
			if (err)
				console.error(new Error("Failed creating file registered-global"));

			process.exit();
		});
	} catch (error) {
		console.error(error);
	}
})();
