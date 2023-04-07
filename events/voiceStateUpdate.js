const { DiscordMusicBot } = require("../structures/DiscordMusicBot");
const { VoiceState, MessageEmbed } = require("discord.js");
const botconfig = require("../botconfig");
/**
 *
 * @param {DiscordMusicBot} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (client, oldState, newState) => {
  // get guild and player
  let guildId = newState.guild.id;
  const player = client.Manager.get(guildId);

  // check if the bot is active (playing, paused or empty does not matter (return otherwise)
  if (!player || player.state !== "CONNECTED") return;

  // prepreoces the data
  const stateChange = {};
  // get the state change
  if (oldState.channel === null && newState.channel !== null)
    stateChange.type = "JOIN";
  if (oldState.channel !== null && newState.channel === null)
    stateChange.type = "LEAVE";
  if (oldState.channel !== null && newState.channel !== null)
    stateChange.type = "MOVE";
  if (oldState.channel === null && newState.channel === null) return; // you never know, right
  if (newState.serverMute == true && oldState.serverMute == false)
    return player.pause(true);
  if (newState.serverMute == false && oldState.serverMute == true)
    return player.pause(false);
  // move check first as it changes type
  if (stateChange.type === "MOVE") {
    if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
    if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
  }
  // double triggered on purpose for MOVE events
  if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
  if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

  // check if the bot's voice channel is involved (return otherwise)
  if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
    return;

  // filter current users based on being a bot
  stateChange.members = stateChange.channel.members.filter(
    (member) => !member.user.bot
  );

  switch (stateChange.type) {
    case "JOIN":
      if (stateChange.members.size === 1 && player.paused) {
        let emb = new MessageEmbed()
          .setAuthor(`Resuming paused queue`, client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `Resuming playback because all of you left me with music to play all alone`
          );
        await client.channels.cache.get(player.textChannel).send(emb);

        // update the now playing message and bring it to the front
        let msg2 = await client.channels.cache
          .get(player.textChannel)
          .send(player.nowPlayingMessage.embeds[0]);
        player.setNowplayingMessage(msg2);

        player.pause(false);
      }
      break;
    case "LEAVE":
      if (client.botconfig.AutoLeave) {
        if (
          stateChange.members.size === 0 &&
          !player.paused &&
          player.playing
        ) {
          // Schedule bot to leave voice channel after 30 seconds of being alone
          const timer = setTimeout(async () => {
            player.destroy();
            let emb = new MessageEmbed()
              .setAuthor(`Left the VC!`, client.botconfig.IconURL)
              .setColor(client.botconfig.EmbedColor)
              .setDescription(
                `Left the voice channel because I was alone for more than \`30\` seconds`
              );
            await client.channels.cache.get(player.textChannel).send(emb);
          }, 30000);

          player.timer = timer;

          let emb = new MessageEmbed()
            .setAuthor(`Paused!`, client.botconfig.IconURL)
            .setColor(client.botconfig.EmbedColor)
            .setDescription(
              `The player has been paused because everybody left`
            );
          await client.channels.cache.get(player.textChannel).send(emb);
        } else if (player.timer) {
          // If the bot is no longer alone, cancel the scheduled timer
          clearTimeout(player.timer);
          player.timer = null;
        }
        break;
      }
  }
};
