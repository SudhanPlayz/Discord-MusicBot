/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 */
 export default (client) => {
  client.manager.init(client.user.id);
  client.user.setPresence(client.config.presence);
  client.log("Successfully Logged in as " + client.user.tag);
};
