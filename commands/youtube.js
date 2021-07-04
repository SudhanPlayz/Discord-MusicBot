const { MessageEmbed } = require("discord.js");
const _fetch = require('node-fetch');
const { Token } = require("../config.js");

module.exports = {
    name: "youtube",
    description: "Starts a YouTube Together session",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["yt"],
    
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {require("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, message, args, { GuildDB }) => {

        const voice = message.member.voice.channel
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to use this command!**");
        if (!message.member.voice.channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return client.sendTime(message.channel, "❌ | **Please make sure I can create an invite for this command to work!**");

        _fetch(`https://discord.com/api/v8/channels/${voice.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${Token}`,
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then((invite) => {
            let game1 = new MessageEmbed()
                .setColor("#FF0000")
                .setAuthor('YouTube Together', 'https://images-ext-1.discordapp.net/external/aAP-hvnvnxIMKvkUf1YMT9rqTU448PZbYfY1gnIMhRo/%3Fv%3D1/https/cdn.discordapp.com/emojis/749289646097432667.png')
                .setDescription(`
                            Using **YouTube Together**, you can watch YouTube with your friends directly in a Voice Channel. Click the invite below to watch together!

                            __**https://discord.com/invite/${invite.code}**__
                            
                            :warning: **Attention**: This works only works in Desktop!`)
            message.channel.send(game1)
            message.channel.send(`https://discord.com/invite/${invite.code}`)
        })

    },

    SlashCommand: {
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
            const voiceChannel = member.voice.channel.id; // id was missin

            _fetch(`https://discord.com/api/v8/channels/${voiceChannel}/invites`, {
                method: 'POST',
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "755600276941176913",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${Token}`,
                    "Content-Type": "application/json"
                }
            }).then(response => response.json()).then((invite) => {
                let embed = new MessageEmbed()
                    .setColor("#FF0000")
                    .setAuthor('YouTube Together', 'https://images-ext-1.discordapp.net/external/aAP-hvnvnxIMKvkUf1YMT9rqTU448PZbYfY1gnIMhRo/%3Fv%3D1/https/cdn.discordapp.com/emojis/749289646097432667.png')
                    .setDescription(`
                          Using **YouTube Together**, you can watch YouTube with your friends directly in a Voice Channel. Click the invite below to watch together!

                            __**https://discord.com/invite/${invite.code}**__
                            
                            :warning: **Attention**: This works only works in Desktop!`)
                interaction.send(embed)
            })
        },
    },
};
