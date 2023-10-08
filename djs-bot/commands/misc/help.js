const {
	EmbedBuilder,
	ComponentType,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	Message,
} = require("discord.js");
const { capitalize } = require("../../util/string");
const SlashCommand = require("../../lib/SlashCommand");
const { getClient } = require("../../bot");
const { getButtons } = require("../../util/embeds");

/** @type {SlashCommand} */
module.exports = {
	name: "help",
	usage: "/help <command?>",
	options: [
		{
			type: 3, // "STRING"
			name: "command",
			description: "What command do you want to view",
			required: false,
			autocomplete: true,
		},
	],
	autocompleteOptions: () =>
		getClient().slash.map((cmd) => {
			return { name: cmd.name, value: cmd.name };
		}),
	category: "misc",
	description: "Return all commands, or one specific command!",
	ownerOnly: false,
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
				embeds: [
					new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setTitle("Are you sure you wrote that correctly?")
						.setDescription(
							"No command by that name exists\nUse `/help` to get a full list of the commands"
						),
				],
				ephemeral: true,
			});
		} else if (client.slash.has(commandArg)) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setTitle(commandArg)
						.setDescription(
							`${
								client.slash.get(commandArg)
									.ownerOnly
									? "**(Owner Only)**"
									: ""
							}\n**Description:**\n${
								client.slash.get(commandArg)
									.description
							}\n${
								client.slash.get(commandArg).usage
									? "**Usage:**\n" +
									  client.slash.get(
											commandArg
									  ).usage
									: ""
							}`
						)
						.setFooter({
							text: "For a more complete list of the available commands use `/help` without any arguments.",
						}),
				],
			});
		}

		//await interaction.deferReply().catch((_) => {});

		let initialEmbed = new EmbedBuilder()
			.setTitle("Slash Commands")
			.setDescription(
				"Here's a basic list of all the commands to orient yourself on the functionalities of the bot:"
			)
			.setColor(client.config.embedColor);
		let helpMenuActionRow = new ActionRowBuilder();
		let helpSelectMenu = new StringSelectMenuBuilder()
			.setCustomId("helpSelectMenu")
			.setPlaceholder("No Category Selected")
			.addOptions([{ label: "Commands Overview", value: "overview" }]);

		const categories = client.slash.reduce((prev, val) => {
			const foundCategory = prev.find((v) => v.category === val.category);
			const categoryObject = foundCategory || {
				category: val.category,
				commands: [],
			};

			categoryObject.commands.push({
				commandName: val.name,
				fileObject: val,
			});

			if (!foundCategory) return [...prev, categoryObject];

			return prev;
		}, []);

		for (const dir of categories) {
			const category = categories.find(
				(selected) => selected.category === dir.category
			);
			const categoryName = dir.category;
			if (category.commands.length) {
				initialEmbed.addFields([
					{
						name: capitalize(categoryName),
						value: category.commands
							.map((cmd) =>
								cmd.fileObject.ownerOnly
									? null
									: `\`${cmd.commandName}\``
							)
							.filter(Boolean)
							.join(", "),
					},
				]);
				helpSelectMenu.addOptions([
					{
						label: `${capitalize(categoryName)} commands`,
						value: categoryName,
					},
				]);
			}
		}
		helpMenuActionRow.addComponents(helpSelectMenu);

		initialEmbed.addFields([
			{
				name: "Credits",
				value:
					`Discord Music Bot Version: v${
						require("../../package.json").version
					}; Build: ${gitHash}` +
					"\n" +
					`[✨ Support Server](https://discord.gg/sbySMS7m3v) | [Issues](https://github.com/SudhanPlayz/Discord-MusicBot/issues) | [Source](https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5) | [Invite Me](https://discord.com/oauth2/authorize?client_id=${
						client.config.clientId
					}&permissions=${
						client.config.permissions
					}&scope=${client.config.scopes
						.toString()
						.replace(/,/g, "%20")})`,
			},
		]);

		// when defer is active this needs to edit the previous reply instead
		/**
		 * @type {Message}
		 */
		const menuSelectEmbed = await interaction.reply({
			embeds: [initialEmbed],
			components: [helpMenuActionRow],
		});
		const collector = menuSelectEmbed.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
		});
		let buttonCollector;
		let currentPage = 0;

		collector.on("collect", async (collectedInteraction) => {
			const category = collectedInteraction.values[0];
			let helpCategoryEmbed = new EmbedBuilder();
			if (category === "overview") {
				helpCategoryEmbed = initialEmbed;
				await collectedInteraction.update({
					embeds: [helpCategoryEmbed],
					components: [helpMenuActionRow],
				});
			} else {
				const commandFiles = client.slash
					.filter((slash) => slash.category === category)
					.map((slash) => slash);

				if (!commandFiles.length) {
					await collectedInteraction.update({
						embeds: [
							new EmbedBuilder()
								.setDescription(`No commands found for ${category} category...
					Please select something else.`),
						],
					});
				} else if (commandFiles.length > 25) {
					const maxPages = Math.ceil(commandFiles.length / 25);

					helpCategoryEmbed = new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setTitle(`${capitalize(category)} Commands`)
						.setFooter({
							text: `Page ${
								currentPage + 1
							} of ${maxPages}`,
						});
					let commandFilesPerPage = commandFiles.slice(
						currentPage * 25,
						(currentPage + 1) * 25
					);
					/** @type {Array<{name: string, value: string}>} */
					let fieldsPerPage = [];

					for (let command of commandFilesPerPage) {
						/** @type {SlashCommand} */
						const slashCommand = command;
						if (!slashCommand.ownerOnly)
							fieldsPerPage.push({
								name: `${command.name}`,
								value: slashCommand.description,
							});
					}
					helpCategoryEmbed.addFields(fieldsPerPage);

					const helpCategoryMessage =
						await collectedInteraction.update({
							embeds: [helpCategoryEmbed],
							components: [
								helpMenuActionRow,
								getButtons(
									currentPage,
									maxPages
								),
							],
						});

					if (!buttonCollector) {
						buttonCollector =
							helpCategoryMessage.createMessageComponentCollector(
								{
									componentType:
										ComponentType.Button,
								}
							);

						buttonCollector.on("collect", async (button) => {
							if (button.customId === "previous_page") {
								currentPage--;
							} else if (
								button.customId === "next_page"
							) {
								currentPage++;
							}

							helpCategoryEmbed = new EmbedBuilder()
								.setColor(client.config.embedColor)
								.setTitle(
									`${capitalize(
										category
									)} Commands`
								)
								.setFooter({
									text: `Page ${
										currentPage + 1
									} of ${maxPages}`,
								});

							commandFilesPerPage = commandFiles.slice(
								currentPage * 25,
								(currentPage + 1) * 25
							);
							fieldsPerPage = [];
							for (let command of commandFilesPerPage) {
								/** @type {SlashCommand} */
								const slashCommand = command;
								if (!slashCommand.ownerOnly)
									fieldsPerPage.push({
										name: `${command.name}`,
										value: slashCommand.description,
									});
							}
							helpCategoryEmbed.addFields(fieldsPerPage);

							await button.update({
								embeds: [helpCategoryEmbed],
								components: [
									helpMenuActionRow,
									getButtons(
										currentPage,
										maxPages
									),
								],
							});
						});
					}
				} else {
					helpCategoryEmbed
						.setColor(client.config.embedColor)
						.setTitle(`${capitalize(category)} Commands`);

					for (let command of commandFiles) {
						/** @type {SlashCommand} */
						const slashCommand = command;
						if (!slashCommand.ownerOnly)
							helpCategoryEmbed.addFields([
								{
									name: `${command.name}`,
									value: slashCommand.description,
								},
							]);
					}
					await collectedInteraction.update({
						embeds: [helpCategoryEmbed],
						components: [helpMenuActionRow],
					});
				}
			}
		});
	},
};
