
module.exports = {
    name: "speed",
    description: "changes Speed of The Current Playing song",
    usage: "<1-10>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["speed", "fast"],
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
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **You must be in the same voice channel as me to use this command!**");

        if (!args[0]) return client.sendTime(message.channel, "**Please Specifty a number between 1-10"); //if the user do not provide args [arguments]

        if (isNaN(args[0])) return client.sendTime(message.channel,"❌ | **Amount Must Be A Number** ");
        if (args[0] < 0) return message.channel.send('Speed must be greater than 0.');
		if (args[0] > 10) return message.channel.send('Speed must be less than 10.');
        player.node.send({
            op: 'filters',
            guildId:  message.guild.id || message.guild,
			timescale: { speed: args[0] },
		});

        return client.sendTime(message.channel, `✅ | **Speed set to** \`${args[0]}\`x`);
    },
    SlashCommand: {
        options: [
            {
                name: "speed",
                description: `Please provide a value, value: 1-10`,
                value: "[value]",
                type: 3,
                required: true,
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


            let player = await client.Manager.get(interaction.guild_id);
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return client.sendTime(interaction, ":x: | **You must be in the same voice channel as me to use this command!**");
            if (!args[0]) return client.sendTime(message.channel, "**Please Specifty a number between 1-10"); //if the user do not provide args [arguments]

            if (isNaN(args[0])) return client.sendTime(message.channel,"❌ | **Amount Must Be A Number** ");
            if (args[0] < 0) return client.sendTime(message.channel,'❌ | **Speed must be greater than 0.**');
            if (args[0] > 10) return client.sendTime(message.channel,'❌ | **Speed must be less than 10.**');
            player.node.send({
                op: 'filters',
                guildId:  interaction.guild.id || interaction.guild,
                timescale: { speed: args[0] },
            });
    
            return client.sendTime(interaction, `✅ | **Speed set to** \`${args[0]}\`x`);

        },
    },
};
