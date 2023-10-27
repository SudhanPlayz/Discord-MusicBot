const { joinStageChannelRoutine, addTrack } = require("../../../util/player");
const { capitalize } = require("../../../util/string");
const { redEmbed } = require("../../../util/embeds");
const { reply } = require("../../../util/commands");

/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function play(baseCommand) {
    baseCommand.addSubSlashCommand((command) =>
        command
            .setName("play")
            .setDescription("Select a playlist to add to the queue")
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
        "play",
        async function (client, interaction, options) {
            return runPlay(client, interaction, options);
        }
    );
};

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
        addTrack(player, songSearch.tracks[0]);
    }

    if (channel.type == "GUILD_STAGE_VOICE") {
        joinStageChannelRoutine(interaction.guild.members.me);
    }

    if (!player.playing) {
        player.play();
    }

    return reply(interaction, `Playing **${playlist.name}**`);
}
