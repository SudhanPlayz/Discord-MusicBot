/**
 * Get the first available Lavalink node
 * @param {import("../lib/Bot")} client
 * @returns {Promise<
 * 						import("erela.js").Node | 
 * 					 	import("shoukaku").Node>}
 */
module.exports = async (client) => {
	return new Promise((resolve) => {
		resolve(undefined);
	});
};