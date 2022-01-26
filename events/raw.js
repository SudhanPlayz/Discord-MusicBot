/**
 *
 * @param {import("../lib/DiscordMusicBot").default} client
 * @param {*} data
 */
export default (client, data) => {
  client.manager.updateVoiceState(data);
};
