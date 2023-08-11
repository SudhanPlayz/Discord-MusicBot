/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function controlChannel(baseCommand) {
	baseCommand.addSubcommand((command) =>
		command
		.setName("control-channel")
		.setDescription("Set server control channel")
		.addChannelOption((opt) =>
			opt
			.setName("channel")
			.setDescription(
				"Set this channel as server control channel, leave empty to reset"
			)
		)
	);

	return baseCommand.setSubCommandHandler("control-channel", async function(client, interaction, options) {
		console.log("control-channel");
	});
};
