/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 */
module.exports = (client) => {
  client.manager.init(client.user.id);
  client.log("Successfully Logged in as " + client.user.tag);
};
