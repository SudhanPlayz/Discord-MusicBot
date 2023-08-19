const { getClient } = require("../bot");
const { MessageEmbed } = require("../lib/Embed");
const prettyMilliseconds = require("pretty-ms");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { escapeMarkdown } = require("discord.js");

/**
 * @typedef {object} ColorEmbedParams
 * @property {import("discord.js").ColorResolvable} color
 * @property {string} desc
 *
 * @param {ColorEmbedParams}
 */
const colorEmbed = ({ color, desc }) =>
	new MessageEmbed().setColor(color || getClient().config.embedColor).setDescription(desc);

/**
 * @param {ColorEmbedParams}
 */
const successEmbed = ({ color, desc = "Success" } = {}) =>
	colorEmbed({ color: color, desc: `✅ | **${desc}**` });

/**
 * @param {ColorEmbedParams}
 */
const errorEmbed = ({ color, desc = "Error" } = {}) =>
	colorEmbed({ color: color, desc: `❌ | **${desc}**` });

/**
 * @param {ColorEmbedParams} options
 */
const redEmbed = (options = {}) => colorEmbed({ color: "Red", ...options });

const embedNoLLNode = () =>
	redEmbed({
		desc: "Lavalink node is not connected",
	});

const embedNoTrackPlaying = () =>
	redEmbed({
		desc: "Nothing is playing right now.",
	});

const embedNotEnoughTrackToClear = () =>
	errorEmbed({
		desc: "Invalid, Not enough track to be cleared.",
	});

const embedClearedQueue = () =>
	successEmbed({
		desc: "Cleared the queue!",
	});

/**
 * @typedef {object} TrackStartedEmbedParams
 * @property {import("cosmicord.js").CosmiTrack=} track
 *
 * @param {TrackStartedEmbedParams}
 */
const trackStartedEmbed = ({ track } = {}) => {
	const client = getClient();

	const embed = new MessageEmbed().setColor(client.config.embedColor);

	if (track) {
		// whatever this code was for
		// let activeProperties = [
		// 	player.get("autoQueue") ? "autoqueue" : null,
		// 	player.get("twentyFourSeven") ? "24/7" : null,
		// ]

		embed.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
			.setDescription(`[${track.title}](${track.uri})`)
			.addField("Requested by", `${track.requester}`, true)
			.addField(
				"Duration",
				track.isStream
					? `\`LIVE\``
					: `\`${prettyMilliseconds(track.duration, {
							secondsDecimalDigits: 0,
					  })}\``,
				true
			);
		// .setFooter({ text: `${activeProperties.filter(e => e).join(" • ")}` }); // might error?

		try {
			embed.setThumbnail(track.displayThumbnail("maxresdefault"));
		} catch (err) {
			embed.setThumbnail(track.thumbnail);
		}
	} else {
		// !TODO: finish this
		embed.setTitle("No song currently playing").setImage(
			"https://cdn.discordapp.com/avatars/788006279837909032/e4cf889f9fe19f9b4dd5301d51bddcb2.webp?size=4096"
		);
	}

	return embed;
};

/**
 * @typedef {object} ControlChannelMessageParams
 * @property {string} guildId
 * @property {TrackStartedEmbedParams["track"]} track
 *
 * @param {ControlChannelMessageParams}
 * @returns {import("discord.js").MessagePayload | import("discord.js").MessageCreateOptions}
 */
const controlChannelMessage = ({ guildId, track } = {}) => {
	const prev = new ButtonBuilder()
		.setCustomId("cc/prev")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏮️");

	const playpause = new ButtonBuilder()
		.setCustomId("cc/playpause")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏯️");

	const stop = new ButtonBuilder()
		.setCustomId("cc/stop")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("⏹️");

	const next = new ButtonBuilder()
		.setCustomId("cc/next")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏭️");

	const firstRow = new ActionRowBuilder().addComponents(prev, playpause, stop, next);

	const lowerVolume = new ButtonBuilder()
		.setCustomId("cc/vlower")
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("🔉");

	const louderVolume = new ButtonBuilder()
		.setCustomId("cc/vlouder")
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("🔊");

	const autoqueue = new ButtonBuilder()
		.setCustomId("cc/autoqueue")
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("♾️");

	const secondRow = new ActionRowBuilder().addComponents(
		lowerVolume,
		louderVolume,
		autoqueue
	);

	const components = [firstRow, secondRow];

	return {
		content: "Join a voice channel and queue songs by name or url in here.",
		embeds: [trackStartedEmbed({ track })],
		components,
	};
};

/**
 * @typedef {object} AddQueueEmbedParams
 * @property {import("cosmicord.js").CosmiTrack} track
 * @property {import("../lib/clients/MusicClient").CosmicordPlayerExtended} player
 * @property {string} requesterId
 *
 * @param {AddQueueEmbedParams}
 */
const addQueueEmbed = ({ track, player, requesterId }) => {
	const client = getClient();

	const title = escapeMarkdown(track.title).replace(/\]|\[/g, "");

	const embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: "Added to queue", iconURL: client.config.iconURL })
		.setDescription(`[${title}](${track.uri})` || "No Title")
		.setURL(track.uri)
		.addFields(
			{
				name: "Added by",
				value: `<@${requesterId}>`,
				inline: true,
			},
			{
				name: "Duration",
				value: track.isStream
					? `\`LIVE 🔴 \``
					: `\`${client.ms(track.duration, {
							colonNotation: true,
							secondsDecimalDigits: 0,
					  })}\``,
				inline: true,
			}
		);

	try {
		embed.setThumbnail(track.displayThumbnail("maxresdefault"));
	} catch (err) {
		embed.setThumbnail(track.thumbnail);
	}

	if (player.queue.totalSize > 1) {
		embed.addFields({
			name: "Position in queue",
			value: `${player.queue.size}`,
			inline: true,
		});
	}

	return embed;
};

/**
 * @typedef {object} LoadedPlaylistEmbedParams
 * @property {import("cosmicord.js").CosmiLoadedTracks} searchResult
 * @property {string} query
 *
 * @param {LoadedPlaylistEmbedParams}
 */
const loadedPlaylistEmbed = ({ searchResult, query }) => {
	const client = getClient();

	const embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({
			name: "Playlist added to queue",
			iconURL: client.config.iconURL,
		})
		.setThumbnail(searchResult.tracks[0].thumbnail)
		.setDescription(`[${searchResult.playlist.name}](${query})`)
		.addFields(
			{
				name: "Enqueued",
				value: `\`${searchResult.tracks.length}\` songs`,
				inline: true,
			},
			{
				name: "Playlist duration",
				value: `\`${client.ms(searchResult.playlist.duration, {
					colonNotation: true,
					secondsDecimalDigits: 0,
				})}\``,
				inline: true,
			}
		);

	return embed;
};

const autoQueueEmbed = ({ autoQueue }) => {
	const client = getClient();
	return new MessageEmbed()
		.setColor(client.config.embedColor)
		.setDescription(`**Auto Queue is** \`${!autoQueue ? "ON" : "OFF"}\``)
		.setFooter({
			text: `Related music will ${
				!autoQueue ? "now be automatically" : "no longer be"
			} added to the queue.`,
		});
};

module.exports = {
	successEmbed,
	errorEmbed,
	colorEmbed,
	redEmbed,
	embedNoLLNode,
	embedNoTrackPlaying,
	embedNotEnoughTrackToClear,
	embedClearedQueue,
	controlChannelMessage,
	trackStartedEmbed,
	addQueueEmbed,
	loadedPlaylistEmbed,
	autoQueueEmbed,
};
