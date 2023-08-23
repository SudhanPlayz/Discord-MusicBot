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
			const role = options.getRole("role", false);

			const guildId = interaction.guild.id;
			const roleId = role?.id || null;

			try {
				await client.db.guild.upsert({
					where: {
						guildId,
					},
					create: { DJRole: roleId, guildId },
					update: { DJRole: roleId },
				});
			} catch (e) {
				client.error(e);

				return interaction.reply("Error updating config");
			}

			const reply = !roleId ? "DJ Role reset!" : "DJ Role set!";

			return interaction.reply(reply);
		}
	);
};
