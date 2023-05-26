const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("../../lib/Embed");
const escapeMarkdown = require("discord.js").Utils.escapeMarkdown;
const yt = require("youtube-sr").default;

async function testUrlRegex(string) {
	return [
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
		/^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
		/^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
		/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
		/(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/
	].some((regex) => {
		return regex.test(string);
	});
}

const command = new SlashCommand()
	.setName("play")
	.setDescription(
		"Searches and plays the requested song \nSupports: \nYoutube, Spotify, Deezer, Apple Music"
	)
	.addStringOption((option) =>
		option
			.setName("query")
			.setDescription("What am I looking for?")
			.setAutocomplete(true)
			.setRequired(true)
	)
	.setAutocompleteOptions(async (input) => {
		if (input.length <= 3) return [];
		if (await testUrlRegex(input)) return [{ name: "URL", value: input }];

		const random = "ytsearch"[Math.floor(Math.random() * "ytsearch".length)];
		const results = await yt.search(input || random, { safeSearch: false, limit: 25 });

		const choices = [];
		for (const video of results) {
			choices.push({ name: video.title, value: video.url });
		}
		return choices;
	})
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}

		let node = await client.getLavalink(client);
		if (!node) {
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("Red")
					.setTitle("Playback error!")
					.setDescription(`Failed to load track: \`${title}\``)
					.setFooter({
						text: "Oops! something went wrong but it's not your fault!",
					})],
			});
		}

		let player = client.manager.createPlayer(client, interaction.channel, channel);

		if (player.state !== "CONNECTED") {
			/** @todo make connection a thing in the music manager */
			player.connect();
		}

		if (channel.type == "GUILD_STAGE_VOICE") {
			setTimeout(() => {
				if (interaction.guild.members.me.voice.suppress == true) {
					try {
						interaction.guild.members.me.voice.setSuppressed(false);
					} catch (e) {
						interaction.guild.members.me.voice.setRequestToSpeak(true);
					}
				}
			}, 2000); // Need this because discord api is buggy asf, and without this the bot will not request to speak on a stage - Darren
		}

		const ret = await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(":mag_right: **Searching...**"),
			],
			fetchReply: true,
		});

		let query = options.getString("query", true);
		let res = await player.search(query, interaction.user).catch((err) => {
			client.error(err);
			return {
				loadType: "LOAD_FAILED",
			};
		});

		if (res.loadType === "LOAD_FAILED") {
			if (!player.queue.current) {
				player.destroy();
			}
			await interaction
				.editReply({
					embeds: [
						new MessageEmbed()
							.setColor("Red")
							.setDescription("There was an error while searching"),
					],
				})
				.catch(this.warn);
		}

		if (res.loadType === "NO_MATCHES") {
			if (!player.queue.current) {
				player.destroy();
			}
			await interaction
				.editReply({
					embeds: [
						new MessageEmbed()
							.setColor("Red")
							.setDescription("No results were found"),
					],
				})
				.catch(this.warn);
		}

		if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
			player.queue.add(res.tracks[0]);

			if (!player.playing && !player.paused && !player.queue.size) {
				player.play();
			}
			var title = escapeMarkdown(res.tracks[0].title);
			var title = title.replace(/\]|\[/g, "");
			let addQueueEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setAuthor({ name: "Added to queue", iconURL: client.config.iconURL })
				.setDescription(`[${title}](${res.tracks[0].uri})` || "No Title")
				.setURL(res.tracks[0].uri)
				.addFields(
					{
						name: "Added by",
						value: `<@${interaction.user.id}>`,
						inline: true,
					},
					{
						name: "Duration",
						value: res.tracks[0].isStream
							? `\`LIVE 🔴 \``
							: `\`${client.ms(res.tracks[0].duration, {
								colonNotation: true,
								secondsDecimalDigits: 0,
							})}\``,
						inline: true,
					}
				);

			try {
				addQueueEmbed.setThumbnail(
					res.tracks[0].displayThumbnail("maxresdefault")
				);
			} catch (err) {
				addQueueEmbed.setThumbnail(res.tracks[0].thumbnail);
			}

			if (player.queue.totalSize > 1) {
				addQueueEmbed.addFields({
					name: "Position in queue",
					value: `${player.queue.size}`,
					inline: true,
				});
			} else {
				player.queue.previous = player.queue.current;
			}

			await interaction.editReply({ embeds: [addQueueEmbed] }).catch(this.warn);
		}

		if (res.loadType === "PLAYLIST_LOADED") {
			player.queue.add(res.tracks);

			if (
				!player.playing &&
				!player.paused &&
				player.queue.totalSize === res.tracks.length
			) {
				player.play();
			}

			let playlistEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setAuthor({
					name: "Playlist added to queue",
					iconURL: client.config.iconURL,
				})
				.setThumbnail(res.tracks[0].thumbnail)
				.setDescription(`[${res.playlist.name}](${query})`)
				.addFields(
					{
						name: "Enqueued",
						value: `\`${res.tracks.length}\` songs`,
						inline: true,
					},
					{
						name: "Playlist duration",
						value: `\`${client.ms(res.playlist.duration, {
							colonNotation: true,
							secondsDecimalDigits: 0,
						})}\``,
						inline: true,
					}
				);

			await interaction.editReply({ embeds: [playlistEmbed] }).catch(this.warn);
		}

		if (ret) setTimeout(() => ret.delete().catch(this.warn), 20000);
		return ret;
	});

module.exports = command;