/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function controlChannel(baseCommand) {
	return baseCommand.addSubcommand((command) =>
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
};
