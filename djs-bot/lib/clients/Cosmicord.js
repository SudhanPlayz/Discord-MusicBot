/* Typings */
const Bot = require("../Bot");

/* Imports */
const colors = require("colors");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Cosmicord, CosmiPlayer, CosmiNode } = require("cosmicord.js");
const { updateControlMessage } = require("../../util/controlChannel");
const { handleTrackStart } = require("../MusicEvents");
const { pause } = require("../../util/player");

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
		/** @type {boolean} */
		this.twentyFourSeven = false;
	}

	/** The guild id of the player */
	get guild() {
		return this.options.guildId;
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

	/**
		 * Set's (maps) the client's resume message so it can be deleted afterwards
		 * @param {Bot} client
		 * @param {import("discord.js").Message} message
		 * @returns the Set Message
		 */
	setResumeMessage(client, message) {
		if (this.pausedMessage && !client.isMessageDeleted(this.pausedMessage)) {
			this.pausedMessage.delete();
			client.markMessageAsDeleted(this.pausedMessage);
		}
		return (this.resumeMessage = message);
	}

	/**
	 * Set's (maps) the client's paused message so it can be deleted afterwards
	 * @param {Bot} client
	 * @param {import("discord.js").Message} message
	 * @returns
	 */
	setPausedMessage(client, message) {
		if (this.resumeMessage && !client.isMessageDeleted(this.resumeMessage)) {
			this.resumeMessage.delete();
			client.markMessageAsDeleted(this.resumeMessage);
		}
		return (this.pausedMessage = message);
	}

	/**
	 * Set's (maps) the client's now playing message so it can be deleted afterwards
	 * @param {Bot} client
	 * @param {import("discord.js").Message} message
	 * @returns
	 */
	setNowplayingMessage(client, message) {
		if (this.nowPlayingMessage && !client.isMessageDeleted(this.nowPlayingMessage)) {
			this.nowPlayingMessage.delete();
			client.markMessageAsDeleted(this.nowPlayingMessage);
		}
		return (this.nowPlayingMessage = message);
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
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Danger)
				.setCustomId(`controller:${guild}:Stop`)
				.setEmoji("⏹️"),

			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setCustomId(`controller:${guild}:Replay`)
				.setEmoji("⏮️"),

			new ButtonBuilder()
				.setStyle(player.playing ? ButtonStyle.Primary : ButtonStyle.Danger)
				.setCustomId(`controller:${guild}:PlayAndPause`)
				.setEmoji(player.playing ? "⏸️" : "▶️"),

			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
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
	let errorEmbed = new EmbedBuilder()
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
		.on("playerMoved", async (node, player, oldChannel, newChannel) => {
			const guild = client.guilds.cache.get(player.guildId);
			if (!guild) return;
			const channel = guild.channels.cache.get(player.textChannel);
			if (oldChannel === newChannel) return;
			if (newChannel === null || !newChannel) {
				if (!player) return;
				if (channel) {
					const msg = await channel.send({
						embeds: [
							new EmbedBuilder()
							.setColor(client.config.embedColor)
							.setDescription(`Disconnected from <#${oldChannel}>`),
						],
					}).catch(client.warn);

					setTimeout(() => msg?.delete().catch(client.warn), 20000);
				}
				return player.destroy();
			} else {
				player.voiceChannel = newChannel;
				setTimeout(() => pause(player,false), 1000);
				return undefined;
			}
		})

		.on("playerCreated", (node, player) =>
			client.warn(`Player: ${player.guildId} | A music player has been created in ${client.guilds.cache.get(player.guildId) ? client.guilds.cache.get(player.guildId).name : "a guild"}`)
		)

		.on("playerDestoryed", (node, player) => {
			client.warn(`Player: ${player.guildId} | A music player has been destroyed in ${client.guilds.cache.get(player.guildId) ? client.guilds.cache.get(player.guildId).name : "a guild"}`)
			updateControlMessage(player.guild);
		})

                  // !TODO: integrate events with socket
		.on("trackStart",
			/** @param {CosmicordPlayerExtended} player */
			async (player, track) => {
				handleTrackStart({
					player, track
				});
			}
		)

		.on("queueEnd",
			/** @param {CosmicordPlayerExtended} player */
			async (player) => {
				const autoQueue = player.get("autoQueue");

				if (autoQueue) {
					const track = player.queue.previous;
					const requester = player.get("requester");
					const identifier = track.identifier;
					const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
					const res = await player.search(search, requester).catch(err => console.log(err));
					console.log(res);
					let nextTrackIndex;

					const identifierMap = client.playedTracks.map(track => track.identifier);
					res.tracks.some((track, index) => {
						nextTrackIndex = index;
						return !identifierMap.includes(track.identifier)
					});

					if (res.exception) {
						client.channels.cache.get(player.textChannel)
							.send({
								embeds: [new EmbedBuilder()
									.setColor("Red")
									.setAuthor({
										name: `${res.exception.severity}`,
										iconURL: client.config.iconURL,
									})
									.setDescription(`Could not load track.\n**ERR:** ${res.exception.message}`)
								]
							});
						return player.destroy();
					}

					player.play(res.tracks[nextTrackIndex]);
					player.queue.previous = track;
				} else {
					const twentyFourSeven = player.get("twentyFourSeven");

					let queueEmbed = new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setAuthor({ name: `The queue has ended ${(twentyFourSeven) ? "but 24/7 is on!" : ""}`, iconURL: client.config.iconURL, })
						.setDescription(`${(twentyFourSeven) ? "The bot will not exit the VC since 24/7 mode has been enabled" : "24/7 was not set, exiting!"}`)
						.setFooter({ text: "If you wish for the queue to never end use `/autoqueue`" })
						.setTimestamp();

					const msg = await client.channels.cache
						.get(player.textChannel)
						.send({ embeds: [queueEmbed] }).catch(client.warn);

					setTimeout(() => msg?.delete().catch(client.warn), 20000);

					try {
						if (!player.playing && !twentyFourSeven) {
							setTimeout(async () => {
								if (!player.playing && player.state !== "DISCONNECTED") {
									const payload = {
										embeds: [new EmbedBuilder()
											.setColor(client.config.embedColor)
											.setAuthor({
												name: "Disconnected",
												iconURL: client.config.iconURL,
											})
											.setDescription(`The player has been disconnected due to inactivity.`)
										]
									};

									const msg = await client.channels.cache.get(player.textChannel)
										.send(payload).catch(client.warn);

									setTimeout(() => msg?.delete().catch(client.warn), 20000);

									player.destroy();
								} else if (player.playing) {
									client.warn(`Player: ${player.options.guild} | A new song was added during the timeout`);
								}
							}, client.config.disconnectTime);
						} else if (!player.playing && twentyFourSeven) {
							client.warn(`Player: ${player.options.guild} | Queue has ended [${colors.blue("24/7 ENABLED")}]`);
						}
					} catch (err) {
						client.error(err);
					}
				}
			}
		);
}
