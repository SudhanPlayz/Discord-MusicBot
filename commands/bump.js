const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "bump",
    description: "Moves a track to the front of the queue.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["b"],
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
        
		// check if args[0] - 1 is a valid number between 2 and player.queue.length - 1
		let trackNum = parseInt(args[0] - 1);
        if (trackNum < 1 || trackNum > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid track number.**");
		}
        
        // Swap array elements
        [player.queue[0], player.queue[trackNum]] = [player.queue[trackNum], player.queue[0]];
		client.sendTime(message.channel, "✅ | **" + player.queue[0].title + "** has been moved to the front of the queue.");
    },

    SlashCommand: {
      options: [
          {
              name: "track",
              value: "track",
              type: 4,
              required: true,
              description: "Moves selected track to the front of the queue.",
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
            
            let player = await client.Manager.get(interaction.guild.id);
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args[0].value) return client.sendTime(interaction, "❌ | **Invalid track number.**");
            
            // check if args[0].value - 1 is a valid number between track 2 and player.queue.length - 1
            let trackNum = parseInt(args[0].value - 1);
            if (trackNum < 1 || trackNum > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Invalid track number.**");
            }

            // Swap array elements
            [player.queue[0], player.queue[trackNum]] = [player.queue[trackNum], player.queue[0]];
            client.sendTime(interaction, "✅ | **" + player.queue[0].title + "** has been moved to the front of the queue.");
        },
    },
};