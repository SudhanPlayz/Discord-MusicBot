const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "skip",
    description: "Skip the current song",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["s", "next"],
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
        player.stop();
        await message.react("✅");
    },
    SlashCommand: {
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);

            const skipTo = interaction.data.options ? interaction.data.options[0].value : null;

            let player = await client.Manager.get(interaction.guild_id);

            if (!player) return interaction.send("Nothing is playing right now...");
            console.log(interaction.data);
            if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return interaction.send("❌ | Invalid number to skip.");
            player.stop(skipTo);
            interaction.send("Skipped the song");
        },
    },
};
