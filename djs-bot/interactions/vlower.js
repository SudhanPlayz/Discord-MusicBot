const SlashCommand = require("../lib/SlashCommand");
const { ccInteractionHook, checkPlayerVolume } = require("../util/interactions");

const command = new SlashCommand()
	.setName("vlower")
	.setCategory("cc")
	.setDescription("Lower Volume interaction")
	.setRun(async (client, interaction, options) => {
		const { error, data } = await ccInteractionHook(client, interaction);

		if (error || !data || data instanceof Promise) return data;

		const { player, channel, sendError } = data;

		// this probably will never run but just in case
		const replied = await checkPlayerVolume(player, interaction);
		if (replied) return replied;

		let vol = player.volume - 20;
		if (vol < 0) vol = 0;

		player.setVolume(vol);

		return interaction.deferUpdate();
	});

module.exports = command;
