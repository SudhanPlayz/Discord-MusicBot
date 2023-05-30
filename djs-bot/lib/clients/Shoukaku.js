const { Shoukaku, Connectors, Player } = require('shoukaku');
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

	/**
	 * Create a player for a guild, binds a voice channel to it
	 * @param {import("discord.js").Guild} guild
	 * @param {import("discord.js").VoiceBasedChannel} voiceChannel
	 * 
	 * @todo Verify if this is the correct way to create a player
	 */
	createPlayer(guild, voiceChannel) {
		const players = this.players;
		const player = players.get(guild.id) ||
			new Player(this.leastUsedNode, {
				guildID: guild.id,
				shardId: guild.shardId,
				channelId: voiceChannel.id
			});

		if (!players.has(guild.id))
			players.set(guild.id, player);

		return player;
	}

	/**
	 * Returns the least used node from the array configured in the config file
	 */
	get leastUsedNode() {
		return this.getNode();
	}
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