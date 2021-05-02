const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "loop",
  description: "To loop the current song/queue",
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
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.config.IconURL)
      .setColor("GREEN")
      .addField("Song loop", player.trackRepeat?"✅":"❌", true)
      .addField("Queue loop", player.queueRepeat?"✅":"❌", true)
      .setFooter("React to your choice below.")
      .setDescription(`
What do you want to loop?

:one: - **Song Loop** (This will loop the current song)
:two: - **Queue Loop** (This will loop the whole queue)
`);

    let LoopingMessage = await message.channel.send(Config);
    await LoopingMessage.react("1️⃣");
    await LoopingMessage.react("2️⃣");
    let emoji = await LoopingMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      LoopingMessage.reactions.removeAll();
      Config.setDescription(
        "You took too long to respond. Run the command again !"
      );
      Config.setFooter("")
      LoopingMessage.edit(Config);
    });
    emoji = emoji.first();
    /**@type {MessageReaction} */
    let em = emoji;
    LoopingMessage.reactions.removeAll();
    let config = new MessageEmbed()

    if (em._emoji.name === "1️⃣") {
        if(player.trackRepeat){
            player.setTrackRepeat(false)
            config.setAuthor("Server Config", client.config.IconURL)
            config.setColor("GREEN")
            config.setDescription("**Loop** \`disabled\`")
            config.addField("Song loop", player.trackRepeat?"✅":"❌", true)
            config.addField("Queue loop", player.queueRepeat?"✅":"❌", true)
            config.setTimestamp();
            LoopingMessage.edit(config);
        }else if (em._emoji.name === "1️⃣") {
            player.setTrackRepeat(true)
            config.setAuthor("Server Config", client.config.IconURL)
            config.setColor("GREEN")
            config.setDescription("**Loop** \`enabled\`")
            config.addField("Song loop", player.trackRepeat?"✅":"❌", true)
            config.addField("Queue loop", player.queueRepeat?"✅":"❌", true)
            config.setTimestamp();
            LoopingMessage.edit(config);
        }
    } if (em._emoji.name === "2️⃣") {
        if(player.queueRepeat){
            player.setQueueRepeat(false)
            config.setAuthor("Server Config", client.config.IconURL)
            config.setColor("GREEN")
            config.setDescription("**Queue loop** \`disabled\`")
            config.addField("Song loop", player.trackRepeat?"✅":"❌", true)
            config.addField("Queue loop", player.queueRepeat?"✅":"❌", true)
            config.setTimestamp();
            LoopingMessage.edit(config);
        }else if (em._emoji.name === "2️⃣"){
            player.setQueueRepeat(true)
            config.setAuthor("Server Config", client.config.IconURL)
            config.setColor("GREEN")
            config.setDescription("**Queue loop** \`enabled\`")
            config.addField("Song loop", player.trackRepeat?"✅":"❌", true)
            config.addField("Queue loop", player.queueRepeat?"✅":"❌", true)
            config.setTimestamp();
            LoopingMessage.edit(config);
        }
    }
  },

  SlashCommand: {
    options: [
      {
        name: "Song",
        value: "song",
        type: 1,
        description: "Loops the song"
      },
      {
        name: "Queue",
        value: "queue",
        type: 2,
        description: "Loops the queue"
      }
    ],
    
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player) return interaction.send("Nothing is playing right now...");
      let loop = (args.value);
        if (loop === "song") {
          if(player.trackRepeat){
              player.setTrackRepeat(false)
              interaction.send("Loop disabled")
          }else{
              player.setTrackRepeat(true)
              interaction.send("Loop enabled")
          }
      } else {
        if (loop === "queue") {
          if(player.queueRepeat){
              player.setQueueRepeat(false)
              interaction.send("Queue loop disabled")
          }else{
              player.setTrackRepeat(true)
              interaction.send("Queue loop enabled")
          }
    }}
      console.log(interaction.data)
    }
  }
};
