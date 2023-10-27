"use strict";

const { colorEmbed } = require("./embeds");

const reply = async (interaction, desc) =>
	interaction[interaction.deferred || interaction.replied ? "editReply" : "reply"]({
		embeds: [
			colorEmbed({
				desc,
			}),
		],
		ephemeral: true,
	});

module.exports = {
	reply,
};
