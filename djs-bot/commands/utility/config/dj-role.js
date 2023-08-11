/**
 * @param {import("../../../lib/SlashCommand")} baseCommand
 */
module.exports = function djRole(baseCommand) {
	baseCommand.addSubcommand((command) =>
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

	return baseCommand.setSubCommandHandler(
		"dj-role",
		async function (client, interaction, options) {
			console.log("dj-role");
			const role = options.getRole("role", false);

			console.log({
				role,
			});

			if (!role) {
				return interaction.reply("DJ Role reset!");
			}
		}
	);
};
