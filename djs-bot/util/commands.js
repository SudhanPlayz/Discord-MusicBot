"use strict";

const { colorEmbed } = require("./embeds");

const reply = async (interaction, desc) =>
	interaction.reply({
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
