const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "To shuffle the queue",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["shuff"],
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

        if (!player.queue || !player.queue.length || player.queue.length === 0) return message.channel.send("Not enough songs in the queue to shuffle!");
        player.queue.shuffle();
        let embed = new MessageEmbed().setColor("RANDOM").setDescription(`Shuffled the queue!`);
        await message.channel.send(embed);
        await message.react("✅");
    },
    SlashCommand: {
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return interaction.send("❌ | You must be on a voice channel.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return interaction.send(`❌ | You must be on ${guild.me.voice.channel} to use this command.`);

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction.channel, "❌ | **Nothing is playing right now...**");
            if (!player.queue || !player.queue.length || player.queue.length === 0) return interaction.send("Not enough songs in the queue to shuffle!");
            player.queue.shuffle();
            interaction.send("Shuffled the queue!");
        },
    },
};
