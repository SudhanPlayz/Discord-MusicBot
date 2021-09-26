const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
//const bangerschannel = await client.channels.fetch(<693287105186758706>);

module.exports = {
  name: "banger",
  description: "Saves the current song to your Direct Messages",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["banga"],
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
  if (!player.playing) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
  if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to play something!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **You must be in the same voice channel as me to use this command!**");
   
  let msgEmbed = new MessageEmbed()
   .setAuthor(`Song saved`, client.user.displayAvatarURL({
    dynamic: true
  }))
  .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
  .setURL(player.queue.current.uri)
  .setColor(client.botconfig.EmbedColor)
  .setTitle(`**${player.queue.current.title}**`)
  .addField(`⌛ Duration: `, `\`${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``, true)
  .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
  .addField(`▶ Play it:`, `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
  }play ${player.queue.current.uri}\``)
  .addField(`🔎 Saved in:`, `<#${message.channel.id}>`)
  .setFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
    dynamic: true
  })); 

	// ----
    client.channels.fetch('693287105186758706')
        .then(channel => channel.send(msgEmbed)
             ).catch(console.error);

    //const bangerschannel = await client.channels.fetch('693287105186758706');

    client.sendTime(message.channel, "✅ | **Added to Certified Slappa's!**")
  },
};
