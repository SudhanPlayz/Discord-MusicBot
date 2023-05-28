/* Typings */
const Bot = require("../Bot");

/* Imports */
const colors = require("colors");
const { MessageEmbed } = require('../Embed');
const prettyMilliseconds = require("pretty-ms");

/* Erela.js - Extension */
const { Manager } = require("erela.js"); // <---
const deezer = require("erela.js-deezer"); // <---
const spotify = require("better-erela.js-spotify").default; // <---
const { default: AppleMusic } = require("better-erela.js-apple"); // <---

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
	 * @param {import("discord.js").TextChannel} textChannel 
	 * @param {import("discord.js").VoiceBasedChannel} voiceChannel 
	 * @returns {import("erela.js").Player}
	 */
	createPlayer(textChannel, voiceChannel) {
		return this.create({
			guild: textChannel.guild.id,
			voiceChannel: voiceChannel.id,
			textChannel: textChannel.id,
		});
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
		.on("playerMove", (player, oldChannel, newChannel) => {
			const guild = client.guilds.cache.get(player.guild);
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

		.on("playerCreate", (player) =>
			client.warn(`Player: ${player.options.guild} | A music player has been created in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))

		.on("playerDestroy", (player) =>
			client.warn(`Player: ${player.options.guild} | A music player has been destroyed in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))

		.on("trackStart", async (player, track) => {
			let trackStartedEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
				.setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
				.addField("Requested by", `${track.requester}`, true)
				.addField("Duration", track.isStream ? `\`LIVE\`` : `\`${prettyMilliseconds(track.duration, { colonNotation: true, })}\``, true);
			try {
				trackStartedEmbed.setThumbnail(track.displayThumbnail("maxresdefault"));
			} catch (err) {
				trackStartedEmbed.setThumbnail(track.thumbnail);
			}
			let nowPlaying = await client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [trackStartedEmbed] })
				.catch(client.warn);
			client.warn(`Player: ${player.options.guild} | Track has started playing [${colors.blue(track.title)}]`);
		})
		.on("queueEnd", (player) => {
			client.warn(`Player: ${player.options.guild} | Queue has ended`);
			let queueEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setAuthor({ name: "The queue has ended", iconURL: client.config.iconURL, })
				.setFooter({ text: "Queue ended" })
				.setTimestamp();
			client.channels.cache
				.get(player.textChannel)
				.send({ embeds: [queueEmbed] });
			try {
				if (!player.playing && !player.twentyFourSeven) {
					setTimeout(() => {
						if (!player.playing && player.state !== "DISCONNECTED") {
							let disconnectedEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setAuthor({
									name: "Disconnected",
									iconURL: client.config.iconURL,
								})
								.setDescription(`The player has been disconnected due to inactivity.`);
							client.channels.cache.get(player.textChannel)
								.send({ embeds: [disconnectedEmbed] });
							player.destroy();
						} else if (player.playing) {
							client.warn(`Player: ${player.options.guild} | Still playing`);
						}
					}, client.config.disconnectTime);
				} else if (player.playing || player.twentyFourSeven) {
					client.warn(`Player: ${player.options.guild} | Still playing and 24/7 is active`);
				}
			} catch (err) {
				client.error(err);
			}
		});
}