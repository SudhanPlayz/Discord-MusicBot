const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "loop",
    description: "Loop the current song",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["l", "repeat"],
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
      //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);

        if (player.trackRepeat) {
          player.setTrackRepeat(false)
          client.sendTime(message.channel, `Loop \`disabled\``);
        } else {
          player.setTrackRepeat(true)
          client.sendTime(message.channel, `Loop \`enabled\``);
        }
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
          const voiceChannel = member.voice.channel;
          let player = await client.Manager.get(interaction.guild_id);
          if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**"); 
          if (!member.voice.channel) return interaction.send("❌ | **You must be in a voice channel to use this command!**");
          if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return interaction.send(`❌ | You must be in ${guild.me.voice.channel} to use this command.`);

            if(player.trackRepeat){
                  player.setTrackRepeat(false)
                  client.sendTime(interaction, `Loop \`disabled\``);
              }else{
                  player.setTrackRepeat(true)
                  client.sendTime(interaction, `Loop \`enabled\``);
              }
          console.log(interaction.data)
        }
      }    
};