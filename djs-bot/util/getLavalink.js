/**
 * Get the first available Lavalink node
 * @param {import("../lib/Bot")} client
 * @returns {Promise<
 * 						import("erela.js").Node | 
 * 					 	import("shoukaku").Node>}
 */
module.exports = async (client) => {
	return new Promise((resolve) => {
		for (const node of client.manager.nodes.values()) {
			switch (client.config.musicEngine) {
				case "Erela":
					if (node.connected) return resolve(node);
					break;
				case "Shoukaku":
					if (node.stats === 1) return resolve(node);
					break;
			}
		}
		resolve(undefined);
	});
};