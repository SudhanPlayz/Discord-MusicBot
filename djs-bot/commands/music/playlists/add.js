const { capitalize } = require("../../../util/string");
const yt = require("youtube-sr").default;
const { reply } = require("../../../util/commands");
const { Playlist, Video } = require("youtube-sr");

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

async function addToDb({ songData, client, playlist }) {
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
}

async function handleAddAutocomplete({ focused, input, interaction, client }) {
	switch (focused.name) {
		case "playlist_name": {
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

		case "song": {
			if (input.length <= 3) return [];
			if (await testUrlRegex(input)) return [{ name: "URL", value: input }];

			const random = "ytsearch"[Math.floor(Math.random() * "ytsearch".length)];
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

		default:
			console.error(new Error("Unknown option: " + focused.name));
	}
}

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function add(baseCommand) {
	baseCommand.addSubSlashCommand((command) =>
		command
			.setName("add")
			.setDescription("Select a playlist to add to the queue")
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
					.setDescription("The song you want to add")
					.setRequired(true)
					.setAutocomplete(true)
			)
			.setAutocompleteOptions(async (input, index, interaction, client) => {
				if (!client.db)
					return [{ name: "DB Unavailable", value: "DB_Error" }];

				const focused = interaction.options.getFocused(true);

				return handleAddAutocomplete({
					focused,
					input,
					interaction,
					client,
				});
			})
	);

	return baseCommand.setSubCommandHandler(
		"add",
		async function (client, interaction, options) {
			return runAdd(client, interaction, options);
		}
	);
};

/**
 * @param {import("discord.js").Interaction} interaction
 */
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

	let isPLaylist = false;
	let songData;
	try {
		songData = await yt.getVideo(song);
	} catch (e) {
		console.error("yt.getVideo(song)");
		console.error(e);

		const replyErr = () => {
			if (e?.message?.length) return reply(interaction, e.message);
		};

		const res = await yt.search(song, { safeSearch: false, limit: 25 });

		let t = res[0];

		if (!t) {
			t = await yt.getPlaylist(song, { fetchAll: true });

			if (!t) {
				replyErr();
				return;
			}
		}

		if (t instanceof Playlist) {
			isPLaylist = true;
		} else if (!(t instanceof Video)) {
			replyErr();
			return;
		}

		songData = t;
	}

	if (!songData || (isPLaylist && !songData.videos?.length))
		return reply(interaction, "I couldn't find a song with that name");

	if (isPLaylist) {
		await interaction.deferReply({
			ephemeral: true,
		});

		let i = 0;

		for (const t of songData.videos || []) {
			await addToDb({ songData: t, client, playlist });
			i++;
		}

		return reply(interaction, `Added **${i} tracks** to playlist **${playlist.name}**`);
	}

	await addToDb({ songData, client, playlist });

	return reply(
		interaction,
		`Added song **${songData.title}** to playlist **${playlist.name}**`
	);
}
