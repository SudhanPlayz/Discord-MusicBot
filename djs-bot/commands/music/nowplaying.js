const { EmbedBuilder, escapeMarkdown, AttachmentBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const createCard = require("songcard");
const path = require("path");

const command = new SlashCommand()
	.setName("nowplaying")
	.setDescription("Shows the song currently playing in the voice channel.")
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

		const song = player.queue.current;

		const noBgURL = path.join(__dirname, "..", "..", "assets", "no_bg.png");

		const cardImage = await createCard(
			(imageBg = song.displayThumbnail("maxresdefault") || noBgURL),
			(imageText = song.title),
			(trackStream = song.isStream),
			(trackDuration = song.duration)
		);

		const attachment = new AttachmentBuilder(cardImage, { name: "card.png" });

		var title = escapeMarkdown(song.title);
		var title = title.replace(/\]/g, "");
		var title = title.replace(/\[/g, "");
		const embed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setAuthor({ name: "Now Playing", iconURL: client.config.iconURL })
			// show who requested the song via setField, also show the duration of the song
			.setFields([
				{
					name: "Requested by",
					value: `<@${song.requester.id}>`,
					inline: true,
				},
			])
			.setDescription(`[${title}](${song.uri})`)
			.setImage("attachment://card.png");
		return interaction.reply({ embeds: [embed], files: [attachment] });
	});
module.exports = command;
