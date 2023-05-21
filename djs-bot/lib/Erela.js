const colors = require("colors");
const { MessageEmbed } = require('./Embed');
const prettyMilliseconds = require("pretty-ms");

/* Erela.js - Extension */
const { Manager, Structure } = require("erela.js"); // <---
const deezer = require("erela.js-deezer"); // <---
const facebook = require("erela.js-facebook"); // <---
const spotify = require("better-erela.js-spotify").default; // <---
const { default: AppleMusic } = require("better-erela.js-apple"); // <---

// This sets up the player structure for erela.js and gives an extra method to work out if there have been some
// async problems with sent messages while trying to set the new playing song's message
// If you want you can try finding a method to fix the deprecated version
Structure.extend("Player", (Player) => class extends Player {
	constructor(...props) {
		super(...props);
		this.twentyFourSeven = false;
	}
	
	setNowplayingMessage(message) {
		if (this.nowPlayingMessage && !this.nowPlayingMessage.deleted)
		//Message#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091
		this.nowPlayingMessage.delete();
		return (this.nowPlayingMessage = message);
	}
});

// https://guides.menudocs.org/topics/erelajs/updating.html
// Original Music Client Structure from -> https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5 <-
// This module makes a bunch of checks to see what is going on with the lavalink
// The `.on(...)` methods check for emitted signals from the process and act accordingly to the
// callback function on said signal, The signals caught here are from Erela.js or sub-node-modules
// https://www.npmjs.com/package/erela.js-vk
module.exports = (client) => {
	let errorEmbed = new MessageEmbed()
	.setColor("Red")
	
	return new Manager({
		// If the lavalink allows it, these plugins (check the imports) will
		// be constructed and used by the music client (player) manager to search
		// grab and play music
		plugins: [
			new deezer(),
			new AppleMusic(),
			new spotify(),
			new facebook(),
		],
		// Gets the inserted nodes from the `config.js`
		nodes: client.config.nodes,
		// Delay between reconnect attempts if connection is lost.
		retryDelay: client.config.retryDelay,
		// for lavalink connection attempts
		retryAmount: client.config.retryAmount,
		// If the player should play automatically once something is searched up or a song in enqueued
		autoPlay: true,
		// This is the identification name on the lavalink for the client being created
		clientName: client.denom,
		// Sends data to websocket (node_modules\erela.js\typings\index.d.ts)
		send: (id, payload) => {
			let guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})
	
	//https://github.com/MenuDocs/erela.js/blob/master/src/structures/Manager.ts
	.on("nodeConnect", (node) =>
	client.log(`Node: ${node.options.identifier} | Lavalink node is connected.`))
	
	.on("nodeReconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is reconnecting.`))
	
	.on("nodeDestroy", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is destroyed.`))
	
	.on("nodeDisconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is disconnected.`))
	
	.on("nodeError", (player, err) => {
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
	
	.on("loadFailed", (node, type, error) =>
	client.warn(`Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`))
	
	.on("trackStart", async (player, track) => {
		let trackStartedEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
		.setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
		.addField("Requested by", `${track.requester}`, true)
		.addField("Duration", track.isStream ? `\`LIVE\`` : `\`${prettyMilliseconds(track.duration, {colonNotation: true,})}\``, true);
		try {
			trackStartedEmbed.setThumbnail(track.displayThumbnail("maxresdefault"));
		} catch (err) {
			trackStartedEmbed.setThumbnail(track.thumbnail);
		}
		let nowPlaying = await client.channels.cache
		.get(player.textChannel)
		.send({	embeds: [trackStartedEmbed] })
		.catch(client.warn);
		player.setNowplayingMessage(nowPlaying);
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