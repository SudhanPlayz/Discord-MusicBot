const { getClient } = require("../bot");
const { MessageEmbed } = require("../lib/Embed");
const prettyMilliseconds = require("pretty-ms");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

/**
 * @typedef {object} ColorEmbedParams
 * @property {import("discord.js").ColorResolvable} color
 * @property {string} desc
 *
 * @param {ColorEmbedParams}
 */
const colorEmbed = ({ color, desc }) => new MessageEmbed().setColor(color).setDescription(desc);

/**
 * @param {ColorEmbedParams}
 */
const successEmbed = ({ color, desc = "Success" } = {}) =>
	colorEmbed({ color: color || getClient().config.embedColor, desc: `✅ | **${desc}**` });

/**
 * @param {ColorEmbedParams}
 */
const errorEmbed = ({ color, desc = "Error" } = {}) =>
	colorEmbed({ color: color || getClient().config.embedColor, desc: `❌ | **${desc}**` });

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

	const components = [new ActionRowBuilder().addComponents(prev, playpause, stop, next)];

	return {
		content: "Join a voice channel and queue songs by name or url in here.",
		embeds: [trackStartedEmbed({ track })],
		components,
	};
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
};
