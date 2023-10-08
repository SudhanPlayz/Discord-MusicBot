const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, escapeMarkdown, AttachmentBuilder } = require("discord.js");
const load = require("lodash");
const pms = require("pretty-ms");
const createCard = require("songcard");
const path = require("path");
const { getButtons } = require("../../util/embeds");

const command = new SlashCommand()
	.setName("queue")
	.setDescription("Shows the current queue")

	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}

		let player;
		if (client.manager.Engine) {
			player = client.manager.Engine.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}

		if (!player) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("The bot isn't in a channel."),
				],
				ephemeral: true,
			});
		}

		if (!player.playing) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("There's nothing playing."),
				],
				ephemeral: true,
			});
		}

		await interaction.deferReply().catch(() => {
		});

		const queue = player.queue;
		if (!queue.length) {
			const song = player.queue.current;
			const noBgURL = path.join(__dirname, "..", "..", "assets", "no_bg.png");

			const cardImage = await createCard(
				(imageBg = song.displayThumbnail("maxresdefault") || noBgURL),
				(imageText = song.title),
				(trackStream = song.isStream),
				(trackDuration = player.position),
				(trackTotalDuration = song.duration)
			);

			const attachment = new AttachmentBuilder(cardImage, { name: "card.png" });

			var title = escapeMarkdown(song.title);
			var title = title.replace(/\]/g, "");
			var title = title.replace(/\[/g, "");
			const embed = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setAuthor({ name: "Now Playing", iconURL: client.config.iconURL })
				.setFields([
					{
						name: "Requested by",
						value: `<@${song.requester}>`,
						inline: true,
					},
				])
				.setDescription(`[${title}](${song.uri})`)
				.setImage("attachment://card.png");
			return interaction.editReply({ embeds: [embed], files: [attachment] });
		}

		const queueGroups = load.chunk(queue, 10);
		const maxPage = queueGroups.length;
		let currentPage = 0;
		let currentGroup = queueGroups[currentPage];

		const song = player.queue.current;
		const noBgURL = path.join(__dirname, "..", "..", "assets", "no_bg.png");

		const cardImage = await createCard(
			(imageBg = song.displayThumbnail("maxresdefault") || noBgURL),
			(imageText = song.title),
			(trackStream = song.isStream),
			(trackDuration = player.position),
			(trackTotalDuration = song.duration)
		);

		const attachment = new AttachmentBuilder(cardImage, { name: "card.png" });

		var title = escapeMarkdown(song.title);
		var title = title.replace(/\]/g, "");
		var title = title.replace(/\[/g, "");

		const embed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setAuthor({ name: "Now Playing", iconURL: client.config.iconURL })
			.setFields([
				{
					name: "Requested by",
					value: `<@${song.requester}>`,
					inline: true,
				},
			])
			.setDescription(`[${title}](${song.uri})`)
			.setImage("attachment://card.png");

		const queueEmbed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setAuthor({ name: "Queue", iconURL: client.config.iconURL })
			.setDescription(
				currentGroup
					.map(
						(song, index) =>
							`**${currentPage * 10 + index + 1}**. [${escapeMarkdown(
								song.title
							)}](${song.uri}) \`[${pms(song.duration)}]\` | <@${song.requester}>`
					)
					.join("\n")
			)
			.setFooter({ text: `Page ${currentPage + 1} of ${maxPage}` });

		const queueMessage = await interaction.editReply({
			embeds: [embed, queueEmbed],
			files: [attachment],
			components: [
				getButtons(currentPage, maxPage)
			],
		});

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = queueMessage.createMessageComponentCollector({
			filter,
			time: 30000,
		});

		collector.on("collect", async (button) => {
			if (button.customId === "previous_page") {
				currentPage--;
			} else if (button.customId === "next_page") {
				currentPage++;
			}

			currentGroup = queueGroups[currentPage];
			let queueEmbed = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setTitle("Song Queue")
				.setDescription(
					currentGroup
						.map(
							(song, index) =>
								`**${currentPage * 10 + index + 1}**. [${escapeMarkdown(
									song.title
								)}](${song.uri}) \`[${pms(song.duration)}]\` | <@${song.requester}>`
						)
						.join("\n")
				)
				.setFooter({ text: `Page ${currentPage + 1} of ${maxPage}` });

			await button.update({
				embeds: [embed, queueEmbed],
				components: [
					getButtons(currentPage, maxPage)
				],
			});
		});
	});

module.exports = command;
