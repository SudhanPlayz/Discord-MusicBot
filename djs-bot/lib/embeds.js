const { getClient } = require("../../bot");
const { MessageEmbed } = require("./Embed");

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

module.exports = {
	successEmbed,
	errorEmbed,
	colorEmbed,
	redEmbed,
	embedNoLLNode,
	embedNoTrackPlaying,
	embedNotEnoughTrackToClear,
	embedClearedQueue,
};
