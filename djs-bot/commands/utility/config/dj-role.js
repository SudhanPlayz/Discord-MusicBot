/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function djRole(baseCommand) {
	return baseCommand.addSubcommand((command) =>
		command
		.setName("dj-role")
		.setDescription("Set server DJ role")
		.addRoleOption((opt) =>
			opt
			.setName("role")
			.setDescription(
				"Set this role as server DJ role, leave empty to reset"
			)
		)
	);
};
