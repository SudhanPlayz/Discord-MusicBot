const { capitalize } = require("../../../util/string");
const { reply } = require("../../../util/commands");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function _delete(baseCommand) {
    baseCommand.addSubSlashCommand((command) =>
        command
            .setName("delete")
            .setDescription("Select a playlist to delete")
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
        "delete",
        async function (client, interaction, options) {
            return runDelete(client, interaction, options);
        }
    );
};

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
