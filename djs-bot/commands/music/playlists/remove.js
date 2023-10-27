const { capitalize } = require("../../../util/string");
const { reply } = require("../../../util/commands");

async function handleRemoveAutocomplete({ focused, input, interaction, client }) {
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
			return songs
				.filter((s) => s.name.toLowerCase().includes(input.toLowerCase()))
				.map((song) => {
					return {
						name: capitalize(song.name),
						value: song.name,
					};
				});
		}

		default:
			console.error(new Error("Unknown option: " + focused.name));
	}
}

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function remove(baseCommand) {
	baseCommand.addSubSlashCommand((command) =>
		command
			.setName("remove")
			.setDescription("Select a songs to remove from your playlist")
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
					.setRequired(true)
					.setAutocomplete(true)
			)
			.setAutocompleteOptions(async (input, index, interaction, client) => {
				if (!client.db)
					return [{ name: "DB Unavailable", value: "DB_Error" }];

				const focused = interaction.options.getFocused(true);

				return handleRemoveAutocomplete({
					focused,
					input,
					interaction,
					client,
				});
			})
	);

	return baseCommand.setSubCommandHandler(
		"remove",
		async function (client, interaction, options) {
			return runRemove(client, interaction, options);
		}
	);
};

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
