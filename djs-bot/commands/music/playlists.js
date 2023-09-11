"use strict";

const SlashCommand = require("../../lib/SlashCommand");
const { joinStageChannelRoutine } = require("../../util/player");
const { capitalize } = require("../../util/string");
const { colorEmbed, redEmbed } = require("../../util/embeds");
const yt = require("youtube-sr").default;

async function testUrlRegex(string) {
	return [
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
		/^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
		/^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
		/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
		/(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/,
	].some((regex) => {
		return regex.test(string);
	});
}

const reply = async (interaction, desc) =>
	interaction.reply({
		embeds: [
			colorEmbed({
				desc,
			}),
		],
		ephemeral: true,
	});

async function runView(client, interaction, options) {
	const playlistName = options.getString("playlist_name");
	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	const playlist = await client.db.playlist.findFirst({
		where: {
			name: playlistName,
			userId: interaction.user.id,
		},
	});

	if (!playlist) return reply(interaction, "You don't have a playlist with that name");

	const songs = await client.db.song.findMany({
		where: {
			playlistId: playlist.id,
		},
	});

	if (!songs.length) return reply(interaction, "That playlist is empty");

	const embed = colorEmbed({
		desc: songs
			.map((song, index) => `${index + 1}. **${song.name}** ${song.artist ?? ""}`)
			.join("\n"),
	})
		.setTitle(`Songs in ${playlist.name}`)
		.setFooter({
			text: `Requested by ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
		});

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

async function runCreate(client, interaction, options) {
	const playlistName = options.getString("playlist_name");

	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	if (playlistName.length < 3)
		return reply(interaction, "The playlist name can't be shorter than 3 characters");

	if (playlistName.length > 32)
		return reply(interaction, "The playlist name can't be longer than 32 characters");

	const playlist = await client.db.playlist.create({
		data: {
			name: playlistName,
			user: {
				connectOrCreate: {
					where: {
						id: interaction.user.id,
					},
					create: {
						id: interaction.user.id,
						username: interaction.user.username,
					},
				},
			},
		},
	});

	return reply(interaction, `Created playlist **${playlist.name}**`);
}

async function runDelete(client, interaction, options) {
	const playlistName = options.getString("playlist_name");
	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	const playlist = await client.db.playlist.findFirst({
		where: {
			name: playlistName,
			userId: interaction.user.id,
		},
	});

	if (!playlist) return reply(interaction, "I couldn't find a playlist with that name");

	if (playlist.userId !== interaction.user.id)
		return reply(interaction, "You can't delete a playlist that isn't yours");

	await client.db.playlist.delete({
		where: {
			id: playlist.id,
		},
	});

	return reply(interaction, `Deleted playlist **${playlist.name}**`);
}

async function runAdd(client, interaction, options) {
	const playlistName = options.getString("playlist_name");
	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	const song = options.getString("song", true);
	if (!song) return reply(interaction, "You need to provide a song to add");

	const playlist = await client.db.playlist.findFirst({
		where: {
			name: playlistName,
			userId: interaction.user.id,
		},
	});

	if (!playlist) return reply(interaction, "I couldn't find a playlist with that name");

	if (playlist.userId !== interaction.user.id)
		return reply(interaction, "You can't add songs to a playlist that isn't yours");

	const songData = await yt.getVideo(song);
	if (!songData) return reply(interaction, "I couldn't find a song with that name");

	const songExists = await client.db.song.findFirst({
		where: {
			name: songData.title,
			link: songData.url,
		},
	});

	if (!songExists) {
		const newSong = await client.db.song.create({
			data: {
				name: songData.title,
				link: songData.url,
				artist: songData.channel.name,
			},
		});

		await client.db.playlist.update({
			where: {
				id: playlist.id,
			},
			data: {
				songs: {
					connect: {
						id: newSong.id,
					},
				},
			},
		});
	} else {
		await client.db.playlist.update({
			where: {
				id: playlist.id,
			},
			data: {
				songs: {
					connect: {
						id: songExists.id,
					},
				},
			},
		});
	}

	return reply(
		interaction,
		`Added song **${songData.title}** to playlist **${playlist.name}**`
	);
}

async function runRemove(client, interaction, options) {
	const playlistName = options.getString("playlist_name");
	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	const song = options.getString("song", true);
	if (!song) return reply(interaction, "You need to provide a song to remove");

	const playlist = await client.db.playlist.findFirst({
		where: {
			name: playlistName,
			userId: interaction.user.id,
		},
	});

	if (!playlist) return reply(interaction, "I couldn't find a playlist with that name");
	if (playlist.userId !== interaction.user.id)
		return reply(
			interaction,
			"You can't remove songs from a playlist that isn't yours"
		);

	const songData = await client.db.song.findFirst({
		where: {
			name: song,
		},
	});
	if (!songData) return reply(interaction, "I couldn't find a song with that name");

	await client.db.playlist.update({
		where: {
			id: playlist.id,
		},
		data: {
			songs: {
				disconnect: {
					id: songData.id,
				},
			},
		},
	});

	return reply(interaction, `Removed **${songData.name}** from **${playlist.name}**`);
}

async function runPlay(client, interaction, options) {
	const playlistName = options.getString("playlist_name");
	if (!playlistName) return reply(interaction, "You need to provide a name for the playlist");

	const playlist = await client.db.playlist.findFirst({
		where: {
			name: playlistName,
			userId: interaction.user.id,
		},
	});

	if (!playlist) return reply(interaction, "I couldn't find a playlist with that name");

	if (playlist.userId !== interaction.user.id)
		return reply(interaction, "You can't play a playlist that isn't yours");

	const songs = await client.db.song.findMany({
		where: {
			playlistId: playlist.id,
		},
	});

	if (!songs.length) return reply(interaction, "That playlist is empty");

	if (!client.manager.Engine)
		return redEmbed({
			desc: "Lavalink node is not connected",
		});

	const manager = client.manager.Engine;

	const node = await client.getLavalink(client);

	if (!node) {
		return interaction.reply({
			embeds: [
				redEmbed({
					desc: `No available nodes to play music on!`,
				})
					.setTitle("Node error!")
					.setFooter({
						text: "Oops! something went wrong but it's not your fault!",
					}),
			],
		});
	}

	const channel = await client.getChannel(client, interaction);
	if (!channel) {
		return;
	}

	if (!manager.players.get(interaction.guild.id)) {
		client.manager.Engine.createPlayer({
			guildId: interaction.guild.id,
			voiceChannel: channel.id,
			textChannel: interaction.channel.id,
		});
	}

	const player = manager.players.get(interaction.guild.id);

	if (player.state !== "CONNECTED") {
		player.connect();
	}

	for (const song of songs) {
		const songSearch = await player.search(song.link, interaction.user.id);
		player.queue.add(songSearch.tracks[0]);
	}

	if (channel.type == "GUILD_STAGE_VOICE") {
		joinStageChannelRoutine(interaction.guild.members.me);
	}

	if (!player.playing) {
		player.play();
	}

	return reply(interaction, `Playing **${playlist.name}**`);
}

module.exports = new SlashCommand()
	.setName("playlists")
	.setDescription("Shows your playlists")
	.addStringOption((option) =>
		option
			.setName("operation")
			.setDescription("What do you want to do")
			.setRequired(true)
			.setChoices(
				{ name: "View", value: "view" },
				{ name: "Play", value: "play" },
				{ name: "Create", value: "create" },
				{ name: "Delete", value: "delete" },
				{ name: "Add", value: "add" },
				{ name: "Remove", value: "remove" }
			)
	)
	.addStringOption((option) =>
		option
			.setName("playlist_name")
			.setDescription("The name of the playlist")
			.setRequired(true)
			.setAutocomplete(true)
	)
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("The song you want to add/remove")
			.setRequired(false)
			.setAutocomplete(true)
	)
	.setAutocompleteOptions(async (input, index, interaction, client) => {
		if (!client.db) return [{ name: "DB Unavailable", value: "DB_Error" }];

		if (index == 1) {
			const playlists = await client.db.playlist.findMany({
				where: {
					user: {
						id: interaction.user.id,
					},
				},
			});

			return playlists.map((playlist) => {
				return {
					name: capitalize(playlist.name),
					value: playlist.name,
				};
			});
		}

		if (index == 2) {
			const operation = interaction.options.getString("operation");
			if (operation === "remove") {
				const playlistName = interaction.options.getString("playlist_name");
				if (!playlistName) return [];
				const playlist = await client.db.playlist.findFirst({
					where: {
						name: playlistName,
						userId: interaction.user.id,
					},
				});
				if (!playlist) return [];
				const songs = await client.db.song.findMany({
					where: {
						playlistId: playlist.id,
					},
				});
				return songs.map((song) => {
					return {
						name: capitalize(song.name),
						value: song.name,
					};
				});
			}

			if (operation === "add") {
				if (input.length <= 3) return [];
				if (await testUrlRegex(input))
					return [{ name: "URL", value: input }];

				const random = "ytsearch"[
					Math.floor(Math.random() * "ytsearch".length)
				];
				const results = await yt.search(input || random, {
					safeSearch: false,
					limit: 25,
				});

				const choices = [];
				for (const video of results) {
					choices.push({
						name: video.title,
						value: video.url,
					});
				}
				return choices;
			}

			return [];
		}
	})
	.setCategory("music")
	.setUsage("/playlists")
	.setDBMS()
	.setRun(async (client, interaction, options) => {
		const operation = options.getString("operation");

		switch (operation) {
			case "view":
				return runView(client, interaction, options);
			case "create":
				return runCreate(client, interaction, options);
			case "delete":
				return runDelete(client, interaction, options);
			case "add":
				return runAdd(client, interaction, options);
			case "remove":
				return runRemove(client, interaction, options);
			case "play":
				return runPlay(client, interaction, options);
		}
	});
