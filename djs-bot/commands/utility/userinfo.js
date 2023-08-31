const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "userinfo",
	category: "utility",
	usage: "/userinfo <user?>",
	description: "Get information on a user or yourself",
	options: [
		{
			name: "user",
			type: 6, // "USER"
			description:
				"User you want to get information about. If omitted, will return your information",
			required: false,
		},
	],
	permissions: [],
	ownerOnly: false,
	run: async (client, interaction, options) => {
		const target = interaction.options.getUser("user") || interaction.user;
		const member = interaction.guild.members.cache.get(target.id);
		const status = {
			offline: "Offline",
			online: "Online",
			idle: "Idle",
			dnd: "Do Not Disturb",
		};

		// Filtering out @everyone role and getting the roles of roles for the member
		const roles = member.roles.cache
			.map((roles) => {
				if (roles.name != "@everyone") return `<@&${roles.id}>`;
			})
			.join(" ");

		const embed = new EmbedBuilder()
			.setColor(client.config.embedColor || member.displayHexColor || "RANDOM")
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setAuthor({
				name: `${target.tag} (${target.id})`,
				iconURL: target.displayAvatarURL({ dynamic: true }),
			})
			.addFields([
				{
					name: "**User Information**",
					value: [
						`**❯ Username:** ${target.username}`,
						`**❯ Discriminator:** ${target.discriminator}`,
						`**❯ ID:** ${target.id}`,
						`**❯ Avatar:** [Link to avatar](${target.displayAvatarURL(
							{ dynamic: true }
						)})`,
						`**❯ Time Created:** ${new Date(
							target.createdTimestamp
						).toLocaleString()}`,
						`**❯ Status:** ${status[target.presence?.status]}`,
						`**❯ Bot:** ${target.bot}`,
					]
						.join("\n")
						.toString(),
				},
				{
					name: "**Member Information**",
					value: [
						`**❯ Highest Role:** ${
							member.roles.highest.id ===
							interaction.guild.id
								? "None"
								: `<@&${member.roles.highest.id}>`
						}`,
						`**❯ Server Join Date:** ${new Date(
							member.joinedTimestamp
						).toLocaleString()}`,
						`**❯ Roles [${
							member.roles.cache.size - 1
						}]:** ${roles}`,
					]
						.join("\n")
						.toString(),
				},
			])
			.setTimestamp();

		interaction.reply({ embeds: [embed] });
	},
};
