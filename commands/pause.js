const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "pause",
    description: "To pause the current song",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
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
        if (player.paused) return message.channel.send("Music is already paused!");
        player.pause(true);
        let embed = new MessageEmbed().setAuthor(`Paused!`, client.config.IconURL).setColor("RANDOM").setDescription(`Type \`${GuildDB.prefix}resume\` to play!`);
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
            if (!player) return interaction.send("❌ | **Nothing is playing right now...**");
            if (player.paused) return interaction.send("Music is already paused!");
            player.pause(true);
            interaction.send("**⏸ Paused!**");
        },
    },
};
