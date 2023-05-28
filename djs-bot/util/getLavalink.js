/**
 * Get the first available Lavalink node
 * @param {import("../lib/Bot")} client
 */
module.exports = async (client) => {
	return (client.manager.Engine.leastUsedNode);
};