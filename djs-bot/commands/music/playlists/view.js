const { capitalize } = require("../../../util/string");
const { colorEmbed } = require("../../../util/embeds");
const { reply } = require("../../../util/commands");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function view(baseCommand) {
    baseCommand.addSubSlashCommand((command) =>
        command
            .setName("view")
            .setDescription("Select a playlist to of which to see the contents")
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
        "view",
        async function (client, interaction, options) {
            return runView(client, interaction, options);
        }
    );
};

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
