const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "leave",
    description: "To leave the voice channel",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["stop", "exit", "quit", "dc", "disconnect"],
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
        await message.channel.send(":notes: | **The player has stopped and the queue has been cleared.**");
        await message.react("✅");
        player.destroy();
    },

    SlashCommand: {
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return interaction.send("❌ | You must be on a voice channel.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return interaction.send(`❌ | You must be on ${guild.me.voice.channel} to use this command.`);

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return interaction.send("❌ | **Nothing is playing right now...**");
            player.destroy();
            interaction.send(":notes: | **The player has stopped and the queue has been cleared.**");
        },
    },
};
