const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "seek",
    description: "Seek to a position in the song",
    usage: "<time s/m/h>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["forward"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to use this command!**");
        if (!player.queue.current.isSeekable) return message.channel.send("This song is not able to seek from.");
        let SeekTo = client.ParseHumanTime(args.join(" "));
        if (!SeekTo) return message.channel.send("Please enter a time to seek!");
        player.seek(SeekTo * 1000);
        message.react("✅");
    },

    SlashCommand: {
        options: [
            {
                name: "time",
                description: "Seek to any part of a song",
                value: "time",
                type: 1,
                required: true,
                options: [],
                run: async (client, interaction, args, { GuildDB }) => {
                    const guild = client.guilds.cache.get(interaction.guild_id);
                    const member = guild.members.cache.get(interaction.member.user.id);

                    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
                    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);

                    let player = await client.Manager.get(interaction.guild_id);
                    if (!player) return interaction.send("❌ | **Nothing is playing right now...**");
                    if (!player.queue.current.isSeekable) return interaction.send("This song is not able to seek from.");
                    let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                    if (!SeekTo) return interaction.send("Please enter a time to seek!");
                    player.seek(SeekTo * 1000);
                    interaction.send("Successfully moved the song to ", Seekto);
                },
            },
        ],
    },
};

