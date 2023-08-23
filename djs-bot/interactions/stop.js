const SlashCommand = require("../lib/SlashCommand");
const { ccInteractionHook } = require("../util/interactions");
const playerUtil = require("../util/player");

const command = new SlashCommand()
	.setName("stop")
	.setCategory("cc")
	.setDescription("Stop interaction")
	.setRun(async (client, interaction, options) => {
		const { error, data } = await ccInteractionHook(client, interaction);

		if (error || !data || data instanceof Promise) return data;

		const { player, channel, sendError } = data;

		const status = playerUtil.stop(player);

		return interaction.deferUpdate();
	});

module.exports = command;
