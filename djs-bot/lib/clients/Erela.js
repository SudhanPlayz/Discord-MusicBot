/* Typings */
const Bot = require("../Bot");

/* Imports */
const colors = require("colors");
const { MessageEmbed, MessageActionRow, MessageButton } = require('../Embed');

/* Erela.js - Extension */
const { Manager, Structure } = require("erela.js"); // <---
const deezer = require("erela.js-deezer"); // <---
const spotify = require("better-erela.js-spotify").default; // <---
const { default: AppleMusic } = require("better-erela.js-apple"); // <---
const { updateControlMessage, updateNowPlaying, runIfNotControlChannel } = require("../../util/controlChannel");

Structure.extend(
	"Player",
	/** @param {import("erela.js").Player} Player */
	(Player) => class extends Player {
		/** @returns {import("erela.js").Player} */
		constructor(...props) {
			super(...props);
			this.twentyFourSeven = false;
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
	},
);

class ErelaExtended extends Manager {
	/**
	 * @param {Bot} client
	 * @param {import("erela.js").ManagerOptions} options
	 */
	constructor(client, options) {
		super(options);

		client.once("ready", () => this.init(client.user.id));
		client.on("raw", (data) => this.updateVoiceState(data));
	}

	/**
	 * Create a player for a guild, binds a text channel and voice channel to it
	 * @param {{ guildId: string, voiceChannel: string, textChannel: string }} options
	 * @returns {import("erela.js").Player}
	 */
	createPlayer(options) {
		return this.create({
			guild: options.guildId,
			voiceChannel: options.voiceChannel,
			textChannel: options.textChannel,
		});
	}

	/**
	 * Creates the buttons for the controller on the message for a player
	 * @param {import("discord.js").Guild} guild 
	 * @param {import("erela.js").Player} player 
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
				.setEmoji("⏭️"),

			new MessageButton()
				.setStyle(
					player.trackRepeat
						? "SUCCESS"
						: player.queueRepeat
							? "SUCCESS"
							: "Danger"
				)
				.setCustomId(`controller:${guild}:Loop`)
				.setEmoji(player.trackRepeat ? "🔂" : player.queueRepeat ? "🔁" : "🔁")
		);
	}

	/**
	 * Returns the least used node from the array configured in the config file
	 * @returns {import("erela.js").Node}
	 */
	get leastUsedNode() {
		if (this.leastUsedNodes.first() !== undefined)
			return this.leastUsedNodes.first();
		else if (this.nodes.size > 0)
			return this.nodes.first();
		else
			return undefined;
	}
}

/**
 * Erela.js Music Client
 * @param {Bot} client
 * @returns {ErelaExtended}
*/
module.exports = (client) => {
	let errorEmbed = new MessageEmbed()
		.setColor("Red")

	// https://guides.menudocs.org/topics/erelajs/updating.html
	// Original Music Client Structure from -> https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5 <-
	// This module makes a bunch of checks to see what is going on with the lavalink
	// The `.on(...)` methods check for emitted signals from the process and act accordingly to the
	// callback function on said signal, The signals caught here are from Erela.js or sub-node-modules
	// https://www.npmjs.com/package/erela.js-vk
	return new ErelaExtended(client, {
		// If the lavalink allows it, these plugins (check the imports) will
		// be constructed and used by the music client (player) manager to search
		// grab and play music
		plugins: [
			new deezer(),
			new AppleMusic(),
			new spotify(),
		],
		nodes: client.config.nodes,
		clientName: client.denom,
		send: (id, payload) => {
			let guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
		autoPlay: true,
	})

		//https://github.com/MenuDocs/erela.js/blob/master/src/structures/Manager.ts
		.on("nodeCreate", (node) =>
			client.log(`Node: ${node.options.identifier} | Lavalink node is created.`))

		.on("nodeConnect", (node) =>
			client.log(`Node: ${node.options.identifier} | Lavalink node is connected.`))

		.on("nodeReconnect", (node) =>
			client.warn(`Node: ${node.options.identifier} | Lavalink node is reconnecting.`))

		.on("nodeDestroy", (node) =>
			client.warn(`Node: ${node.options.identifier} | Lavalink node is destroyed.`))

		.on("nodeDisconnect", (node) =>
			client.warn(`Node: ${node.options.identifier} | Lavalink node is disconnected.`))

		.on("nodeError", (_, err) => {
			// Erela emits an error on "ready" signal from the client.
			// Since the wrapper is archived, I can't fix it. So I'm just
			// gonna ignore it.
			if (err.message.includes("Unexpected op \"ready\"")) return;
			client.error(err);
			errorEmbed
				.setTitle("Node error!")
				.setDescription(`\`\`\`${err.error}\`\`\``)

			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [errorEmbed] });
		})
		.on("trackError", (player, err) => {
			client.error(`Track has an error: ${err.error}`);
			errorEmbed
				.setTitle("Playback error!")
				.setDescription(`\`\`\`${err.error}\`\`\``)

			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [errorEmbed] });
		})
		.on("trackStuck", (player) => {
			client.warn(`Track has an error: ${err.error}`);
			errorEmbed
				.setTitle("Track error!")
				.setDescription(`\`\`\`${err.error}\`\`\``)

			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [errorEmbed] });
		})
		.on("playerMove", async (player, oldChannel, newChannel) => {
			const guild = client.guilds.cache.get(player.guild);
			if (!guild) return;
			const channel = guild.channels.cache.get(player.textChannel);
			if (oldChannel === newChannel) return;
			if (newChannel === null || !newChannel) {
				if (!player) return;
				if (channel) {
					const msg = await channel.send({
						embeds: [
							new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(`Disconnected from <#${oldChannel}>`),
						],
					}).catch(client.warn);

					setTimeout(() => msg?.delete().catch(client.warn), 20000);
				}
				return player.destroy();
			} else {
				player.voiceChannel = newChannel;
				setTimeout(() => player.pause(false), 1000);
				return undefined;
			}
		})

		.on("playerCreate", (player) =>
			client.warn(`Player: ${player.options.guild} | A music player has been created in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))

		.on("playerDestroy", (player) =>
			client.warn(`Player: ${player.options.guild} | A music player has been destroyed in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))

		.on("loadFailed", (node, type, error) =>
			client.warn(`Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`))

		.on("trackStart", async (player, track) => {
			const playedTracks = client.playedTracks;

			if (playedTracks.length >= 25)
				playedTracks.shift();

			if (!playedTracks.includes(track))
				playedTracks.push(track);                     

			updateNowPlaying(player, track);
			updateControlMessage(player.guild, track);

			client.warn(`Player: ${player.options.guild} | Track has started playing [${colors.blue(track.title)}]`);
		})

		.on("queueEnd", async (player, track) => {
			const autoQueue = player.get("autoQueue");

			if (autoQueue) {
				const requester = player.get("requester");
				const identifier = track.identifier;
				const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
				const res = await player.search(search, requester).catch(err => console.log(err));
				let nextTrackIndex;

				const identifierMap = client.playedTracks.map(track => track.identifier);
				res.tracks.some((track, index) => {
					nextTrackIndex = index;
					return !identifierMap.includes(track.identifier)
				});

				if (res.exception) {
					client.channels.cache.get(player.textChannel)
						.send({
							embeds: [new MessageEmbed()
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

				let queueEmbed = new MessageEmbed()
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
									embeds: [new MessageEmbed()
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
		});
}
