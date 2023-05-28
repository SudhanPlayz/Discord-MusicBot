const { Shoukaku, Connectors } = require('shoukaku');
const Bot = require('../Bot');

function parseNode(node) {
	return {
		name: node.identifier,
		url: `${node.host}:${node.port}`,
		auth: node.password,
		secure: node.secure || false,
		group: node.group || 'default', // dunno what this is
	};
}

/**
 * Extended Shoukaku Client
 * Implements additional methods and features
 * to meet the interface of the Music Manager
 */
export class ShoukakuExtended extends Shoukaku {
	constructor(connector, nodes) {
		super(connector, nodes);
	}

	/** @todo */
	createPlayer() {}

	/** @todo */
	get leastUsedNode() {}
}

/**
 * Shoukaku Music Client
 * @param {Bot} client 
 * @returns {ShoukakuExtended}
 */
module.exports = (client) => {
	return new ShoukakuExtended(new Connectors.DiscordJS(client), client.config.nodes.map(parseNode))
	
	/* Event listeners */
	.on('ready', (name) => client.log(`Node ${name} | Lavalink node is connected.`))
	.on('error', (name, error) => client.error(`Node ${name} | Lavalink node has encountered an error: ${error}`));
};