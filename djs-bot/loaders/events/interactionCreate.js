const { MessageEmbed } = require("../../lib/Embed");
const fuzzysort = require('fuzzysort')
const { levDistance } = require('../../util/string');

// Defines whenever a "interactionCreate" event is fired, basically whenever a user writes a slash command in 
// a server in which the bot is present

// node_modules\discord.js\typings\index.d.ts:3971
// @interactionCreate: [interaction: Interaction];
// This module checks some properties of the command and determines if it should be ran for that user or not
module.exports = async (client, interaction) => {

	// Autocomplete handler, takes autocomplete options specified in the command properties 
	// and shows them to the user
	// node_modules\discord.js\src\structures\AutocompleteInteraction.js
	if (interaction.isAutocomplete()) {
		// Getting input from user
		let input = interaction.options.getFocused() || " ";
		// Gets the index of the option in which the user is currently typing
		const index = interaction.options._hoistedOptions.map(option => option.focused).indexOf(true);
		// Gets the autocomplete options provided by the command
		let options = await client.slash.get(interaction.commandName).autocompleteOptions(input, index, interaction);

		// This should make the algorithm faster by pre preparing the array, but no noticable changes
		options.forEach(option => option.filePrepared = fuzzysort.prepare(option.name));
		options.map(option => option.filePrepared);

		fuzzysort.go(input, options, {
			threshold: -10000, // Don't return matches worse than this (higher is faster)
			limit: 30, // Don't return more results than this (lower is faster)
			all: false, // If true, returns all results for an empty search

			key: 'name', // For when targets are objects
		})

		// Avoiding calculating levenshteing distances if it's not needed
		if (options.length > 1) {
			// Assigns Levenshtein distances for each option based on what the user is currently typing
			for (let option of options) {
				option.levenshteinDistance = levDistance(option.name, input);
			}
			// Sorts the array of options and displays it according to the Levenshtein distance from the typed value
			options.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance)
		}
		interaction.respond(options.slice(0, 24));
	}

	// Gets general info from a command during execution, if sent then check the guards
	// run only if everything is valid
	if (interaction.isCommand()) {
		const command = client.slash.get(interaction.commandName);
		if (!command || !command.run) {
			return interaction.reply("Sorry the command you used doesn't have any run function");
		}

		if (command.ownerOnly === true && !client.config.ownerId.includes(interaction.user.id)) {
			return interaction.reply({ content: "This command is only for the bot developers!", ephemeral: true });
		}

		if (command.permissions) {
			let missingUserPerms = [];
			let missingBotPerms = []

			command.permissions.forEach(permission => {
				if (!interaction.guild.members.cache.get(interaction.member.user.id).permissions.has(permission))
					missingUserPerms.push("`" + permission + "`");
				if (!interaction.guild.me.permissions.has(permission))
					missingBotPerms.push("`" + permission + "`");
			});

			let missingPermsEmbed = new MessageEmbed().setColor(client.config.embedColor);
			if (missingUserPerms.length || missingBotPerms.length) {
				if (missingUserPerms.length)
					missingPermsEmbed.addField("You're missing some permissions:", `${missingUserPerms.join(", ")}`)
				if (missingBotPerms.length)
					missingPermsEmbed.addField("I'm missing some permissions:", `${missingBotPerms.join(", ")}`)
				missingPermsEmbed.setFooter({ text: "If you think this is a mistake please contact the manager of this bot in this server." })
				return interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true })
			}
		}

		const args = [];
		for (let option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach(x => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) args.push(option.value);
		}
		try {
			command.run(client, interaction, interaction.options);
		} catch (err) {
			interaction.reply({ content: err.message });
		}
	}
}
