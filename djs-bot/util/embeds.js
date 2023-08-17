const { getClient } = require("../bot");
const { MessageEmbed } = require("../lib/Embed");
const prettyMilliseconds = require("pretty-ms");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const successEmbed = ({ color, desc = "Success" } = {}) =>
	new MessageEmbed()
		.setColor(color || getClient().config.embedColor)
		.setDescription(`✅ | **${desc}**`);

const errorEmbed = ({ color, desc = "Error" } = {}) =>
	new MessageEmbed()
		.setColor(color || getClient().config.embedColor)
		.setDescription(`❌ | **${desc}**`);

const colorEmbed = ({ color, desc }) =>
	new MessageEmbed().setColor(color).setDescription(desc);

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
	}
	else {
		// !TODO: finish this
		embed.setTitle( "No song currently playing")
			.setImage( "https://cdn.discordapp.com/avatars/788006279837909032/e4cf889f9fe19f9b4dd5301d51bddcb2.webp?size=4096");
	}

	return embed;
};

// !TODO: finish this
/**
 * @returns {import("discord.js").MessagePayload | import("discord.js").MessageCreateOptions}
 */
const controlChannelMessage = ({ guildId, track } = {}) => {
	const playpause = new ButtonBuilder()
		.setCustomId("cc/playpause")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏯️");

	const stop = new ButtonBuilder()
		.setCustomId("cc/stop")
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("⏹️");

	const components = [new ActionRowBuilder().addComponents(playpause, stop)];

	return {
		content: "Join a voice channel and queue songs by name or url in here.",
		embeds: [
			trackStartedEmbed({track}),
		],
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
