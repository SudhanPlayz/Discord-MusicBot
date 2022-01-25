/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {*} data
 */
 export default (client, data) => {
  client.manager.updateVoiceState(data);
};
