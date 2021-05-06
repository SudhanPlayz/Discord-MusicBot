const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "play",
    description: "Play your favorite songs",
    usage: "[Song Name|Song URL]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["p"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to play something!**");
        //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, "❌ | **You must be in same voice channel as the bot is in to play something!**");
        let SearchString = args.join(" ");
        if (!SearchString) return client.sendTime(message.channel, `**Usage - **\`${GuildDB.prefix}play [Song Name|Song URL]\``);
        let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
        let Searching = await message.channel.send(":mag_right: Searching...");
        if (!CheckNode || !CheckNode.connected) {
       return client.sendTime(message.channel,"❌ | Lavalink node not connected.");
        }
        const player = client.Manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        let SongAddedEmbed = new MessageEmbed().setColor("RANDOM");

        if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");

        if (player.state != "CONNECTED") await player.connect();

        try {
            if (SearchString.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(SearchString);

                if (Searched.loadType === "PLAYLIST_LOADED") {
                    let songs = [];
                    for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], message.author));
                    player.queue.add(songs);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Playlist added to queue`, message.author.displayAvatarURL());
                    SongAddedEmbed.addField("Enqueued", `\`${Searched.tracks.length}\` songs`, false);
                    //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
                    Searching.edit(SongAddedEmbed);
                } else if (Searched.loadType.startsWith("TRACK")) {
                    player.queue.add(TrackUtils.build(Searched.tracks[0], message.author));
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Added to queue`, client.config.IconURL);
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                    SongAddedEmbed.addField("Author", Searched.tracks[0].info.author, true);
                    //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Position in queue", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                } else {
                    return client.sendTime(message.channel, "**No matches found for - **" + SearchString);
                }
            } else {
                let Searched = await player.search(SearchString, message.author);
                if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");

                if (Searched.loadType === "NO_MATCHES") return client.sendTime(message.channel, "**No matches found for - **" + SearchString);
                else if (Searched.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(Searched.tracks);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Playlist added to queue`, client.config.IconURL);
                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.playlist.name}](${SearchString})`);
                    SongAddedEmbed.addField("Enqueued", `\`${Searched.tracks.length}\` songs`, false);
                    SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.playlist.duration, { colonNotation: true })}\``, false);
                    Searching.edit(SongAddedEmbed);
                } else {
                    player.queue.add(Searched.tracks[0]);
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Added to queue`, client.config.IconURL);

                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`);
                    SongAddedEmbed.addField("Author", Searched.tracks[0].author, true);
                    SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Position in queue", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                }
            }
        } catch (e) {
            console.log(e);
            return client.sendTime(message.channel, "**No matches found for - **" + SearchString);
        }
    },

    SlashCommand: {
        options: [
            {
                name: "song",
                value: "song",
                type: 3,
                required: true,
                description: "Play music in the voice channel",
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
            let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
            if (!CheckNode || !CheckNode.connected) {
              return client.sendTime(interaction,"❌ | Lavalink node not connected.");
            }
    
            let player = client.Manager.create({
                guild: interaction.guild_id,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channel_id,
                selfDeafen: false,
            });
            if (player.state != "CONNECTED") await player.connect();
            let search = interaction.data.options[0].value;
            let res;

            if (search.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(search);

                switch (Searched.loadType) {
                    case "LOAD_FAILED":
                        if (!player.queue.current) player.destroy();
                        return interaction.send(`There was an error while searching`);

                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return interaction.send("No results were found.");
                    case "TRACK_LOADED":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        return interaction.send(`**Searched Track** \`${Searched.tracks[0].info.title}\`.`);

                    case "SEARCH_RESULT":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        return interaction.send(`**Searched Track** \`${Searched.tracks[0].info.title}\`.`);

                    case "PLAYLIST_LOADED":
                        let songs = [];
                        for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], member.user));
                        player.queue.add(songs);

                        if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                        return interaction.send(`**Searched playlist**: \n **${Searched.tracks[0].info.title}** : **${Searched.tracks.length} tracks**`);
                }
            } else {
                try {
                    res = await player.search(search, member.user);
                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        throw new Error(res.exception.message);
                    }
                } catch (err) {
                    return interaction.send(`There was an error while searching: ${err.message}`);
                }
                switch (res.loadType) {
                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return interaction.send("No results were found.");
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        return client.sendTime(interaction, `**Added to queue** \n[${res.tracks[0].title}](${res.tracks[0].uri})`);
                    case "PLAYLIST_LOADED":
                        player.queue.add(res.tracks);

                        if (!player.playing && !player.paused && player.queue.size === res.tracks.length) player.play();
                        return client.sendTime(interaction, `**Searched playlist**: \n **${res.playlist.name}** : **${res.tracks.length} tracks**`);
                    case "SEARCH_RESULT":
                        const track = res.tracks[0];
                        player.queue.add(track);

                        if (!player.playing && !player.paused && !player.queue.length) {
                            client.sendTime(interaction, `**Added to queue** [${res.tracks[0].title}](${res.tracks[0].uri})`);
                            player.play();
                        } else {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Added to queue`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("RANDOM");
                            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
                            SongAddedEmbed.addField("Author", track.author, true);
                            SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Position in queue", `${player.queue.size - 0}`, true);
                            interaction.send(SongAddedEmbed);
                        }
                }
            }
        },
    },
};