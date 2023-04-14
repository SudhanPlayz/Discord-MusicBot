/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @returns {import("erela.js").Node | undefined}
 */
module.exports = async (client) => {
  return new Promise((resolve) => {
    for (let i = 0; i < client.manager.nodes.size; i++) {
      client.manager.nodes.forEach((node) => {
        if (node.connected) resolve(node);
      });
    }
    resolve(undefined);
  });
};
