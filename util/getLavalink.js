/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @returns {import("erela.js").Node | undefined}
 */
module.exports = async (client) => {
  return new Promise((resolve) => {
    let node;
    client.manager.nodes.forEach((lNode) => {
      if (lNode.connected) {
        node = lNode;
        resolve(node);
      }
    });
    resolve(node);
  });
};
