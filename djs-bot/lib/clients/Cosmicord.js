/* Typings */
const Bot = require("../Bot");

/* Imports */
const colors = require("colors");
const { MessageEmbed, MessageActionRow, MessageButton } = require('../Embed');
const prettyMilliseconds = require("pretty-ms");
const { Cosmicord, CosmiPlayer, CosmiNode } = require("cosmicord.js");

class CosmicordPlayerExtended extends CosmiPlayer {
	/**
	 * @param {CosmicordExtended} cosmicordExtended
	 * @param {CosmiNode} node
	 * @param {import("cosmicord.js").CosmiPlayerOptions} options
	 */
	constructor(cosmicordExtended, options, node) {
		super(node, options);

		/** @type {CosmicordExtended} */
		this.cosmicord = cosmicordExtended;
	}

	/**
	 * @param {string} query
	 * @param {string} requester requester id
	 * @returns {Promise<import("cosmicord.js").CosmiLoadedTracks>}
	 */
	search(query, requester) {
		return new Promise((resolve, reject) => {
			this.cosmicord.search({ query: query }, requester).then((results) => {
				if (!results || !results.tracks || !results.tracks.length) {
					return reject("No results found!");
				}

				resolve(results);
			}).catch(reject);
		});
	}
}

class CosmicordExtended extends Cosmicord {
	/**
	 * @param {Bot} client
	 * @param {import("cosmicord.js").CosmiOptions} options
	 */
	constructor(client, options) {
		super(options);

		client.once("ready", () => this.init(client.user.id));
		client.on("raw", (data) => this.updateVoiceState(data));
	}

	/**
	 * Creates the buttons for the controller on the message for a player
	 * @param {import("discord.js").Guild} guild 
	 * @param {import("cosmicord.js").CosmiPlayer} player 
	 * @returns 
	 */
	createController(guild, player) {
		return new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle("Danger")
				.setCustomId(`controller:${guild}:Stop`)
				.setEmoji("⏹️"),

			new MessageButton()
				.setStyle("Primary")
				.setCustomId(`controller:${guild}:Replay`)
				.setEmoji("⏮️"),

			new MessageButton()
				.setStyle(player.playing ? "Primary" : "Danger")
				.setCustomId(`controller:${guild}:PlayAndPause`)
				.setEmoji(player.playing ? "⏸️" : "▶️"),

			new MessageButton()
				.setStyle("Primary")
				.setCustomId(`controller:${guild}:Next`)
				.setEmoji("⏭️")
		);

	}

	/**
	 * @param {import("cosmicord.js").CosmiNodeOptions} options 
	 * @param {CosmiNode} node
	 * @override
	 */
	createPlayer(options, node = this.leastUsedNode) {
		return new CosmicordPlayerExtended(this, options, node);
	}

	/**
	 * Returns the least used node from the array configured in the config file
	 * @returns {import("cosmicord.js").CosmiNode | undefined}
	 */
	get leastUsedNode() {
		if (this.getLeastUsedNode() !== undefined)
			return this.getLeastUsedNode();
		else if (this.nodes.length > 0)
			return this.nodes[0]
		else
			return undefined;
	}
}

/**
 * Cosmicord Extended Client
 * @param {Bot} client
 * @returns {CosmicordExtended}
*/
module.exports = (client) => {
	let errorEmbed = new MessageEmbed()
		.setColor("Red")

	return new CosmicordExtended(client, {
		nodes: client.config.nodes,
		clientName: client.denom,
		send: (id, payload) => {
			let guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
		autoPlay: true,
	})

		.on("nodeConnected", (node) =>
			client.log(`Node: ${node.identifier} | Lavalink node is connected.`))

		.on("nodeDestroyed", (node) =>
			client.warn(`Node: ${node.identifier} | Lavalink node is destroyed.`))

		.on("nodeError", (node, err) => {
			client.error(`Node: ${node.identifier} | Lavalink node had an error: ${err}`);
		})
		.on("trackError", (player, err) => {
			client.error(`Track has an error: ${err}`);
			errorEmbed
				.setTitle("Playback error!")
				.setDescription(`\`\`\`${err}\`\`\``)

			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [errorEmbed] });
		})
		.on("playerMoved", (node, player, oldChannel, newChannel) => {
			const guild = client.guilds.cache.get(player.guildId);
			if (!guild) return;
			const channel = guild.channels.cache.get(player.textChannel);
			if (oldChannel === newChannel) return;
			if (newChannel === null || !newChannel) {
				if (!player) return;
				if (channel)
					channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(client.config.embedColor)
								.setDescription(`Disconnected from <#${oldChannel}>`),
						],
					});
				return player.destroy();
			} else {
				player.voiceChannel = newChannel;
				setTimeout(() => player.pause(false), 1000);
				return undefined;
			}
		})

		.on("playerCreated", (node, player) =>
			client.warn(`Player: ${player.guildId} | A music player has been created in ${client.guilds.cache.get(player.guildId) ? client.guilds.cache.get(player.guildId).name : "a guild"}`))

		.on("playerDestoryed", (node, player) =>
			client.warn(`Player: ${player.guildId} | A music player has been destroyed in ${client.guilds.cache.get(player.guildId) ? client.guilds.cache.get(player.guildId).name : "a guild"}`))

		.on("trackStart", async (player, track) => {
			let playedTracks = client.playedTracks;
			if (playedTracks.length >= 25)
				playedTracks.shift();
			if (!playedTracks.includes(track))
				playedTracks.push(track);

			let trackStartedEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
				.setDescription(`[${track.title}](${track.uri})`)
				.addField("Requested by", `${track.requester}`, true)
				.addField("Duration", track.isStream ? `\`LIVE\`` : `\`${prettyMilliseconds(track.duration, { secondsDecimalDigits: 0, })}\``, true);

			try {
				trackStartedEmbed.setThumbnail(track.displayThumbnail("maxresdefault"));
			} catch (err) {
				trackStartedEmbed.setThumbnail(track.thumbnail);
			}

			client.warn(`Player: ${player.guildId} | Track has started playing [${colors.blue(track.title)}]`);
		})

		.on("queueEnd", async (player) => {
			let queueEndEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription("Queue has ended, leaving voice channel.");

			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [queueEndEmbed] });

			player.destroy();
		});
}