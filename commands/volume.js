const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "Changes the Volume",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
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
        if (!parseInt(args[0])) return message.channel.send("Please choose between 1 - 100");
        let vol = parseInt(args[0]);
        player.setVolume(vol);
        message.channel.send(`🔉 | Volume set to \`${player.volume}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "number",
                value: "number 1 - 100",
                type: 4,
                required: true,
                description: "What do you want to change the volume to?",
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | You must be in a voice channel to use this command.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | You must be in ${guild.me.voice.channel} to use this command.`);
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args.length) return client.sendTime(interaction, `🔉 | Current volume \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `Please choose between \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | Volume set to \`${player.volume}\``);
        },
    },
};
