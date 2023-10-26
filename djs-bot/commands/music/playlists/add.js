const { capitalize } = require("../../../util/string");
const yt = require("youtube-sr").default;
const { reply } = require("../../../util/commands");

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
            })
    );

    return baseCommand.setSubCommandHandler(
        "add",
        async function (client, interaction, options) {
            return runAdd(client, interaction, options);
        }
    );
};

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
