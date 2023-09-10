const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const { joinStageChannelRoutine } = require("../../util/player");
const { capitalize } = require("../../util/string");
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

module.exports = new SlashCommand()
	.setName("playlists")
	.setDescription("Shows your playlists")
	.addStringOption((option) => option
		.setName("operation")
		.setDescription("What do you want to do")
		.setRequired(true)
		.setChoices(
			{ name: "View", value: "view" },
			{ name: "Play", value: "play"},
			{ name: "Create", value: "create" },
			{ name: "Delete", value: "delete" },
			{ name: "Add", value: "add" },
			{ name: "Remove", value: "remove" },
		)
	)
	.addStringOption((option) => option
		.setName("playlist_name")
		.setDescription("The name of the playlist")
		.setRequired(true)
		.setAutocomplete(true)
	)
	.addStringOption((option) => option
		.setName("song")
		.setDescription("The song you want to add/remove")
		.setRequired(false)
		.setAutocomplete(true)
	)
	.setAutocompleteOptions(async (input, index, interaction, client) => {
		if (client.db) {
			if (index == 1) {
				const operation = interaction.options.getString("operation");
				if (operation === 'delete' || operation === 'view' || operation === 'add' || operation === 'remove' || operation === 'play') {
					const playlists = await client.db.playlist.findMany({
						where: {
							user: {
								id: interaction.user.id
							}
						}
					});
					return playlists.map(playlist => {
						return { name: capitalize(playlist.name), value: playlist.name }
					});
				} else return [];
			} else if (index == 2) {
				const operation = interaction.options.getString("operation");
				if (operation === 'remove') {
					const playlistName = interaction.options.getString("playlist_name");
					if (!playlistName) return [];
					const playlist = await client.db.playlist.findFirst({
						where: {
							name: playlistName,
							userId: interaction.user.id
						}
					});
					if (!playlist) return [];
					const songs = await client.db.song.findMany({
						where: {
							playlistId: playlist.id
						}
					});
					return songs.map(song => {
						return { name: capitalize(song.name), value: song.name }
					});
				} else if (operation === 'add') {
					if (input.length <= 3) return [];
					if (await testUrlRegex(input)) return [{ name: "URL", value: input }];

					const random = "ytsearch"[Math.floor(Math.random() * "ytsearch".length)];
					const results = await yt.search(input || random, { safeSearch: false, limit: 25 });

					const choices = [];
					for (const video of results) {
						choices.push({ name: video.title, value: video.url });
					}
					return choices;
				} else return [];
			}
		} else return [{ name: "DB Unavailable", value: "DB_Error" }];
	})
	.setCategory("music")
	.setUsage("/playlists")
	.setDBMS()
	.setRun(async (client, interaction, options) => {

		const operation = options.getString("operation");

		if (operation === "view") {
			const playlistName = options.getString("playlist_name");
			if (!playlistName) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You need to provide a name for the playlist")], ephemeral: true });
			const playlist = await client.db.playlist.findFirst({
				where: {
					name: playlistName,
					userId: interaction.user.id
				}
			});
			if (!playlist) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You don't have a playlist with that name")], ephemeral: true });
			const songs = await client.db.song.findMany({
				where: {
					playlistId: playlist.id
				}
			});
			if (!songs.length) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("That playlist is empty")], ephemeral: true });
			const embed = new EmbedBuilder()
				.setColor(client.config.embedColor)
				.setTitle(`Songs in ${playlist.name}`)
				.setDescription(songs.map((song, index) => `${index + 1}. **${song.name}** ${song.artist ?? ""}`).join("\n"))
				.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (operation === "create") {
			const playlistName = options.getString("playlist_name");
			if (!playlistName) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You need to provide a name for the playlist")], ephemeral: true });
			else if (playlistName.length < 3) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("The playlist name can't be shorter than 3 characters")], ephemeral: true });
			else if (playlistName.length > 32) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("The playlist name can't be longer than 32 characters")], ephemeral: true });
			const playlist = await client.db.playlist.create({
				data: {
					name: playlistName,
					user: {
						connectOrCreate: {
							where: {
								id: interaction.user.id
							},
							create: {
								id: interaction.user.id,
								username: interaction.user.username
							},
						},
					}
				}
			});

			return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`Created playlist **${playlist.name}**`)], ephemeral: true });
		} else if (operation === "delete") {
			const playlistName = options.getString("playlist_name");
			if (!playlistName) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You need to provide a name for the playlist")], ephemeral: true });
			const playlist = await client.db.playlist.findFirst({
				where: {
					name: playlistName,
					userId: interaction.user.id
				}
			});
			if (!playlist) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a playlist with that name")], ephemeral: true });
			if (playlist.userId !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You can't delete a playlist that isn't yours")], ephemeral: true });

			await client.db.playlist.delete({
				where: {
					id: playlist.id
				}
			});

			return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`Deleted playlist **${playlist.name}**`)], ephemeral: true });
		} else if (operation === "add") {
			const playlistName = options.getString("playlist_name");
			const playlist = await client.db.playlist.findFirst({
				where: {
					name: playlistName,
					userId: interaction.user.id
				}
			});

			if (!playlist) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a playlist with that name")], ephemeral: true });
			if (playlist.userId !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You can't add songs to a playlist that isn't yours")], ephemeral: true });

			const song = options.getString("song", true);
			if (!song) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You need to provide a song to add")], ephemeral: true });

			const songData = await yt.getVideo(song);
			if (!songData) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a song with that name")], ephemeral: true });

			const songExists = await client.db.song.findFirst({
				where: {
					name: songData.title,
					link: songData.url,
				}
			});

			if (!songExists) {
				const newSong = await client.db.song.create({
					data: {
						name: songData.title,
						link: songData.url,
						artist: songData.channel.name,
					}
				});

				await client.db.playlist.update({
					where: {
						id: playlist.id
					},
					data: {
						songs: {
							connect: {
								id: newSong.id
							}
						}
					}
				});
			} else {
				await client.db.playlist.update({
					where: {
						id: playlist.id
					},
					data: {
						songs: {
							connect: {
								id: songExists.id
							}
						}
					}
				});
			}

			return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`Added song **${songData.title}** to playlist **${playlist.name}**`)], ephemeral: true });
		} else if (operation === "remove") {
			const playlistName = options.getString("playlist_name");
			const playlist = await client.db.playlist.findFirst({
				where: {
					name: playlistName,
					userId: interaction.user.id
				}
			});

			if (!playlist) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a playlist with that name")], ephemeral: true });
			if (playlist.userId !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You can't remove songs from a playlist that isn't yours")], ephemeral: true });

			const song = options.getString("song", true);
			if (!song) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You need to provide a song to remove")], ephemeral: true });
			const songData = await client.db.song.findFirst({
				where: {
					name: song
				}
			});
			if (!songData) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a song with that name")], ephemeral: true });

			await client.db.playlist.update({
				where: {
					id: playlist.id
				},
				data: {
					songs: {
						disconnect: {
							id: songData.id
						}
					}
				}
			});

			return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`Removed **${songData.name}** from **${playlist.name}**`)], ephemeral: true });
		} else if (operation === "play") {
			const playlistName = options.getString("playlist_name");
			const playlist = await client.db.playlist.findFirst({
				where: {
					name: playlistName,
					userId: interaction.user.id
				}
			});

			if (!playlist) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("I couldn't find a playlist with that name")], ephemeral: true });
			if (playlist.userId !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("You can't play a playlist that isn't yours")], ephemeral: true });

			const songs = await client.db.song.findMany({
				where: {
					playlistId: playlist.id
				}
			});

			if (!songs.length) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription("That playlist is empty")], ephemeral: true });

			let player;
			if (client.manager.Engine) {
				player = client.manager.Engine;
			} else {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor("Red")
							.setDescription("Lavalink node is not connected"),
					],
				});
			}

			let node = await client.getLavalink(client);
			if (!node) {
				return interaction.reply({
					embeds: [new EmbedBuilder()
						.setColor("Red")
						.setTitle("Node error!")
						.setDescription(`No available nodes to play music on!`)
						.setFooter({
							text: "Oops! something went wrong but it's not your fault!",
						})],
				});
			}

			let channel = await client.getChannel(client, interaction);
			if (!channel) {
				return;
			}

			if (!player.players.get(interaction.guild.id)) {
			 	client.manager.Engine.createPlayer({
					guildId: interaction.guild.id,
					voiceChannel: channel.id,
					textChannel: interaction.channel.id,
				});
			}

			if (player.players.get(interaction.guild.id).state !== "CONNECTED") {
				player.players.get(interaction.guild.id).connect();
			}

			for (const song of songs) {
				const songSearch = await player.search(song.link, interaction.user.id);
				player.players.get(interaction.guild.id).queue.add(songSearch.tracks[0]);
			}

			if (channel.type == "GUILD_STAGE_VOICE") {
				joinStageChannelRoutine(interaction.guild.members.me);
			}
			
			if (!player.players.get(interaction.guild.id).playing) {
				player.players.get(interaction.guild.id).play();
			}

			return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`Playing **${playlist.name}**`)], ephemeral: true });
		}
	});