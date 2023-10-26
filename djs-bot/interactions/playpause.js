const SlashCommand = require("../lib/SlashCommand");
const { ccInteractionHook } = require("../util/interactions");
const { pause } = require("../util/player");

const command = new SlashCommand()
	.setName("playpause")
	.setCategory("cc")
	.setDescription("Play and Pause interaction")
	.setRun(async (client, interaction, options) => {
		const { error, data } = await ccInteractionHook(client, interaction);

		if (error || !data || data instanceof Promise) return data;

		const { player, channel, sendError } = data;

		if (player.paused) {
			pause(player, false);
		} else pause(player,true);

		return interaction.deferUpdate();
	});

module.exports = command;
