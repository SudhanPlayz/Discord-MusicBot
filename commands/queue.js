const { MessageEmbed, MessageMentions } = require("discord.js");
const sendError = require("../util/error");
const yts = require("yt-search");

module.exports = {
  info: {
    name: "queue",
    description: "See what songs are in the queue",
    usage: "",
    aliases: ["q", "list", "songlist", "song-list"],
  },

  run: async function (client, message, args) {
 
  const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return sendError("Missing permission to manage messages or add reactions",message.channel);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There must be music playing to use that!",message.channel)
    

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, queue.songs);

    const queueEmbed = await message.channel.send(
      `**\`${currentPage + 1}\`**/**${embeds.length}**`,
      embeds[currentPage]
    );

    
    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("🛑");
      await queueEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) =>
      ["⬅️", "🛑", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
      const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });
  
      collector.on("collect", async (reaction, user) => {
        try {
          if (reaction.emoji.name === "➡️") {
            if (currentPage < embeds.length - 1) {
              currentPage++;
              queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
            }
          } else if (reaction.emoji.name === "⬅️") {
            if (currentPage !== 0) {
              --currentPage;
              queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
            }
          } else {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch (error) {
          console.error(error);
          return message.channel.send(error.message).catch(console.error);
        }
      });
    }
  };

function generateQueueEmbed(message, queue) {
  let embeds = [];
  let k = 10;
  let song = null
  song = {
      //title: Util.escapeMarkdown(songInfo.title),
      //views: String(songInfo.views).padStart(10, " "),
      //ago: songInfo.uploadedAt,
      duration: song.durationFormatted,
      //url: `https://www.youtube.com/watch?v=${songInfo.id}`,
      //img: songInfo.thumbnail.url,
      req: message.member,
};

const serverQueue = message.client.queue.get(message.guild.id);

if (serverQueue) {
  //Calculate the estimated Time
  let estimatedtime = Number(0);
  for (let i = 0; i < serverQueue.songs.length; i++) {
    let minutes = serverQueue.songs[i].duration.split(":")[0];   
    let seconds = serverQueue.songs[i].duration.split(":")[1];    
    estimatedtime += (Number(minutes)*60+Number(seconds));   
  }
  if (estimatedtime > 60) {
    estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
    estimatedtime = estimatedtime + " Minutes"
  }
  else if (estimatedtime > 60) {
    estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
    estimatedtime = estimatedtime + " Hours"
  }
  else {
    estimatedtime = estimatedtime + " Seconds"
  }
}

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`+" - "+"<@"+song.req+">").join ("\n");

    const serverQueue =message.client.queue.get(message.guild.id);
    const embed = new MessageEmbed()
    .setAuthor("Queue ", "https://c.tenor.com/HJvqN2i4Zs4AAAAj/milk-and-mocha-cute.gif")//https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif
    .setThumbnail()
    .setColor('RANDOM')
    .setDescription(`${info}`)
    .addField("Now Playing", `[${queue[0].title}](${queue[0].url})`+" - "+"`"+song.duration+"`"+" - "+"<@"+song.req+">", true)
    //.addField("Text Channel", serverQueue.textChannel, true)
    .addField("Voice Channel", serverQueue.voiceChannel, true)
    //.addField("Estimated time until playing:", `${serverQueue.songs.duration}`, true)
    //.setFooter(`Page: ${currentPage + 1}`+"/"+`${queue.length}`)
     if(serverQueue.songs.length === 1)embed.setDescription(`Add songs to the queue with \`\`${message.client.config.prefix}play [YouTube_URL] | [song_name]\`\``)

    embeds.push(embed);
}

  return embeds;
 
};
