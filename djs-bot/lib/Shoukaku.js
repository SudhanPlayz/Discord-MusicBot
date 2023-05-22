const { Shoukaku, Connectors } = require('shoukaku');
const Bot = require('./Bot');

function parseNode(node) {
	return {
		name: node.identifier,
		url: `${node.host}:${node.port}`,
		auth: node.password,
		secure: node.secure || false,
		// group: node.group || 'default', // dunno what this is
	};
}

/**
 * ShoukaKu Music Client
 * @param {Bot} client 
 * @returns {Shoukaku}
 */
module.exports = (client) => {
	return new Shoukaku(new Connectors.DiscordJS(client), client.config.nodes.map(parseNode))
	
	/* Event listeners */
	.on('ready', (name) => client.log(`Node ${name} | Lavalink node is connected.`))
	.on('error', (name, error) => client.error(`Node ${name} | Lavalink node has encountered an error: ${error}`));
};