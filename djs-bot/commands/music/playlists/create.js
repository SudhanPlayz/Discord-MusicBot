const { capitalize } = require("../../../util/string");
const { reply } = require("../../../util/commands");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function create(baseCommand) {
    baseCommand.addSubSlashCommand((command) =>
        command
            .setName("create")
            .setDescription("create a new playlist")
            .addStringOption((option) =>
                option
                    .setName("playlist_name")
                    .setDescription("The name of the playlist")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .setAutocompleteOptions(async (input, index, interaction, client) => {
                if (!client.db) return [{ name: "DB Unavailable", value: "DB_Error" }];
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
            })
    );

    return baseCommand.setSubCommandHandler(
        "create",
        async function (client, interaction, options) {
            return runCreate(client, interaction, options);
        }
    );
};

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
