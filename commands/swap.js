const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "swap",
    description: "Swaps a track's postition with another track.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["s"],
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
        if (!args[0] || !args[1]) return client.sendTime(message.channel, "❌ | **Invalid arguments.**");
        
		// Check if (args[0] - 1) is a valid index
		let trackNum = parseInt(args[0] - 1);
        if (trackNum < 1 || trackNum > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid track number.**");
		}
        
        let dest = parseInt(args[1] - 1);
        if (dest < 1 || dest > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid track number.**");
		}
        
        // Swap array elements
        [player.queue[trackNum], player.queue[dest]] = [player.queue[dest], player.queue[trackNum]];
		client.sendTime(message.channel, "✅ | **" + player.queue[trackNum].title + "** has been swapped with **" + player.queue[dest].title + "**." );
    },

    SlashCommand: {
      options: [
          {
              name: "track1",
              value: "track1",
              type: 4,
              required: true,
              description: "Swaps a track's postition with another track.",
          },
          {
              name: "track2",
              value: "track2",
              type: 4,
              required: true,
              description: "Swaps a track's postition with another track.",
          }
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
            
            let player = await client.Manager.get(interaction.guild.id);
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args[0].value || !args[1].value) return client.sendTime(interaction, "❌ | **Invalid track number.**");
            
            // Check if (args[0] - 1) is a valid index
            let trackNum = parseInt(args[0].value - 1);
            if (trackNum < 1 || trackNum > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Invalid track number.**");
            }

            let dest = parseInt(args[1].value - 1);
            if (dest < 1 || dest > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Invalid track number.**");
            }

            // Swap array elements
            [player.queue[trackNum], player.queue[dest]] = [player.queue[dest], player.queue[trackNum]];
            client.sendTime(interaction, "✅ | **" + player.queue[trackNum].title + "** has been swapped with **" + player.queue[dest].title + "**." );
        },
    },
};