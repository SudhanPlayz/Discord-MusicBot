const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "playnext",
    description: "Move songs through the queue",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["pn"],
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
        
		// check if args[0] - 1 is a valid number between 0 and player.queue.length - 1
		let idx = parseInt(args[0] - 1);
        if (idx < 1 || idx > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid position**");
		}
        
		let entry = player.queue[idx];
		player.queue.splice(idx, 1); // Remove element
		player.queue.splice(0, 0, entry);
        
		client.sendTime(message.channel, "✅ | **" + entry.title + "** Has been moved to position 1.");
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
            
            let player = await client.Manager.get(message.guild.id);
        	if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
        
            // check if args[0] - 1 is a valid number between 0 and player.queue.length - 1
            let idx = parseInt(args[0] - 1);
            if (idx < 1 || idx > player.queue.length - 1) {
                return client.sendTime(message.channel, "❌ | **Invalid position**");
            }

            let entry = player.queue[idx];
            player.queue.splice(idx, 1); // Remove element
            player.queue.splice(0, 0, entry);

            client.sendTime(message.channel, "✅ | **" + entry.title + "** Has been moved to position 1.");
        },
    },
};