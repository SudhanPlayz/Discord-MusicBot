const SlashCommand = require("../lib/SlashCommand");
const { ccInteractionHook } = require("../util/interactions");

const command = new SlashCommand()
	.setName("next")
	.setCategory("cc")
	.setDescription("Next interaction")
	.setRun(async (client, interaction, options) => {
		const { error, data } = await ccInteractionHook(client, interaction);

		if (error || !data || data instanceof Promise) return data;

		const { player, channel, sendError } = data;

		if (player.playing) {
			player.stop();
		}

		return interaction.deferUpdate();
	});

module.exports = command;
