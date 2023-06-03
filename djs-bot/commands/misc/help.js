const {
	MessageEmbed,
	isButtonForUser,
	isSelectMenuForUser,
} = require("../../lib/Embed");
const fs = require("fs");
const { getCommands, getCategories } = require("../../util/getDirs");
const { ComponentType, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { capitalize } = require("../../util/string");
const SlashCommand = require("../../lib/SlashCommand");
const Bot = require("../../lib/Bot");


module.exports = {
	name: "help",
	usage: '/help <command>',
	options: [
		{
			type: 3, // "STRING"
			name: 'command',
			description: 'What command do you want to view',
			required: false,
			autocomplete: true,
		}
	],
	autocompleteOptions: () => getCommands().then((cmds) => {
		return cmds.slash.map(cmd => {
			return { name: cmd.name, value: cmd.name }
		});
	}),
	category: "misc",
	description: "Return all commands, or one specific command!",
	ownerOnly: false,
	/** 
	 * @param {Bot} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const commandArg = interaction.options.getString("command");

		let gitHash = "";
		try {
			gitHash = require("child_process")
				.execSync("git rev-parse --short HEAD")
				.toString()
				.trim();
		} catch (e) {
			gitHash = "unknown";
		}

		if (commandArg && !client.slash.has(commandArg)) {
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle("Are you sure you wrote that correctly?")
					.setDescription("No command by that name exists\nUse `/help` to get a full list of the commands")],
				ephemeral: true
			})
		} else if (client.slash.has(commandArg)) {
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(commandArg)
					.setDescription(`${(client.slash.get(commandArg).ownerOnly ? "**(Owner Only)**" : "")}\n**Description:**\n${client.slash.get(commandArg).description}\n${(client.slash.get(commandArg).usage ? "**Usage:**\n" + client.slash.get(commandArg).usage : "")}`)
					.setFooter({ text: "For a more complete list of the available commands use `/help` without any arguments." })]
			})
		}

		//await interaction.deferReply().catch((_) => {});

		let initialEmbed = new MessageEmbed()
			.setTitle("Slash Commands")
			.setDescription("Here's a basic list of all the commands to orient yourself on the functionalities of the bot:")
			.setColor(client.config.embedColor);
		let helpMenuActionRow = new ActionRowBuilder();
		let helpSelectMenu = new StringSelectMenuBuilder()
			.setCustomId("helpSelectMenu")
			.setPlaceholder("No Category Selected")
			.addOptions([{ label: "Commands Overview", value: "overview" }]);
		let categories = getCategories();
		for (const dir of categories) {
			const category = categories.find(selected => selected.category === dir.category);
			const categoryName = dir.category;
			if (category.commands.length) {
				initialEmbed.addField(capitalize(categoryName), category.commands.map(cmd => cmd.fileObject.ownerOnly ? null : `\`${cmd.commandName}\``).filter(Boolean).join(", "));
				helpSelectMenu.addOptions([
					{
						label: `${capitalize(categoryName)} commands`,
						value: categoryName
					}
				]);
			}
		}
		helpMenuActionRow.addComponents(helpSelectMenu);

		initialEmbed.addField(
			"Credits",
			`Discord Music Bot Version: v${require("../../package.json").version
			}; Build: ${gitHash}` +
			"\n" +
			`[✨ Support Server](https://discord.gg/sbySMS7m3v) | [Issues](https://github.com/SudhanPlayz/Discord-MusicBot/issues) | [Source](https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5) | [Invite Me](https://discord.com/oauth2/authorize?client_id=${client.config.clientId}&permissions=${client.config.permissions}&scope=${client.config.scopes.toString().replace(/,/g, '%20')})`,
		);

		// when defer is active this needs to edit the previous reply instead
		const menuSelectEmbed = await interaction.reply({ embeds: [initialEmbed], components: [helpMenuActionRow] });
		const collector = menuSelectEmbed.createMessageComponentCollector({ isSelectMenuForUser, componentType: ComponentType.StringSelect });

		collector.on("collect", async (category) => {
			category = category.values[0];
			let helpCategoryEmbed = new MessageEmbed();
			if (category === "overview") {
				helpCategoryEmbed = initialEmbed;
			} else {
				const commandFiles = fs
					.readdirSync(`./commands/${category}`)
					.filter((file) => file.endsWith(".js"));
				if (!commandFiles.length) {
					await interaction.editReply({
						embeds: [new MessageEmbed()
							.setDescription(`No commands found for ${category} category...
					Please select something else.`)]
					});
				} else if (commandFiles.length > 25) {
					const maxPages = Math.ceil(commandFiles.length / 25);
					let currentPage = 0;

					helpCategoryEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`${capitalize(category)} Commands`)
						.setFooter({text: `Page ${currentPage + 1} of ${maxPages}`});
					let commandFilesPerPage = commandFiles.slice(currentPage * 25, (currentPage + 1) * 25);
					/** @type {Array<{name: string, value: string}>} */
					let fieldsPerPage = [];
					
					for (let command of commandFilesPerPage) {
						command = command.split(".")[0];
						/** @type {SlashCommand} */
						const slashCommand = client.slash.get(command);
						if (!slashCommand.ownerOnly)
							fieldsPerPage.push({ name: `${command}`, value: slashCommand.description });
					}
					helpCategoryEmbed.addFields(fieldsPerPage);

					const helpCategoryMessage = await interaction.editReply({ embeds: [helpCategoryEmbed], components: [ helpMenuActionRow, helpCategoryEmbed.getButtons(currentPage, maxPages)] });
					const buttonCollector = helpCategoryMessage.createMessageComponentCollector({ isButtonForUser, componentType: ComponentType.Button });

					buttonCollector.on("collect", async (button) => {
						if (button.customId === "previous_page") {
							currentPage--;
						} else if (button.customId === "next_page") {
							currentPage++;
						}

						helpCategoryEmbed = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`${capitalize(category)} Commands`)
							.setFooter({ text: `Page ${currentPage + 1} of ${maxPages}` });

						commandFilesPerPage = commandFiles.slice(currentPage * 25, (currentPage + 1) * 25);
						fieldsPerPage = [];
						for (let command of commandFilesPerPage) {
							command = command.split(".")[0];
							/** @type {SlashCommand} */
							const slashCommand = client.slash.get(command);
							if (!slashCommand.ownerOnly)
								fieldsPerPage.push({ name: `${command}`, value: slashCommand.description });
						}
						helpCategoryEmbed.addFields(fieldsPerPage);

						await button.update({ embeds: [helpCategoryEmbed], components: [helpMenuActionRow, helpCategoryEmbed.getButtons(currentPage, maxPages)] });
					});
				} else {
					helpCategoryEmbed
						.setColor(client.config.embedColor)
						.setTitle(`${capitalize(category)} Commands`);

					for (let command of commandFiles) {
						command = command.split(".")[0];
						/** @type {SlashCommand} */
						const slashCommand = client.slash.get(command);
						if (!slashCommand.ownerOnly)
							helpCategoryEmbed.addField(`${command}`, slashCommand.description);
					}
				}
			}
			await interaction.editReply({ embeds: [helpCategoryEmbed], components: [helpMenuActionRow] });
		});
	}
};