const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "ping",
	category: "utility",
	usage: "/ping",
	description:
		"Is the bot running slow? Check the bot's ping and see if it's lagging or if you are!",
	ownerOnly: false,
	run: async (client, interaction) => {
		const msg = await interaction.channel.send(`🏓 Pinging...`);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(":signal_strength: PONG!")
					.addFields([
						{
							name: "BOT",
							value: `\`\`\`yml\n${Math.floor(
								msg.createdAt -
									interaction.createdAt
							)}ms\`\`\``,
							inline: true,
						},
						{
							name: "API",
							value: `\`\`\`yml\n${client.ws.ping}ms\`\`\``,
							inline: true,
						},
					])
					.setColor(client.config.embedColor)
					.setTimestamp(),
			],
		});
		msg.delete();
	},
};
