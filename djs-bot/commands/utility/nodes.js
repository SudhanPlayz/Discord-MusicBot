const moment = require("moment");
const { EmbedBuilder } = require("discord.js")
const Bot = require("../../lib/Bot");

module.exports = {
	name: "nodes",
	category: "utility",
	usage: "/nodes",
	description: "Check the bot's lavalink node statistics!",
	ownerOnly: false,
	/**
	 * 
	 * @param {Bot} client 
	 * @param {import("discord.js").Interaction} interaction 
	 * @returns 
	 */
	run: async (client, interaction) => {
		let lavauptime, lavaram, lavaclientstats;
		
		const statsEmbed = new EmbedBuilder()
		.setTitle(`${client.user.username} Nodes Information`)
		.setColor(client.config.embedColor)
		
		if (client.manager) {
			for (const [index, lavalinkClient] of client.manager.Engine.nodes.entries()){

				lavaclientstats = lavalinkClient.stats;
				lavacores = lavaclientstats.cpu.cores;
				lavauptime = moment.duration(lavaclientstats.uptime).format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
				lavaram = (lavaclientstats.memory.used / 1024 / 1024).toFixed(2);
				lavalloc = (lavaclientstats.memory.allocated / 1024 / 1024).toFixed(2);
				statsEmbed.addFields([{
					name: `${index}`,
					value: `\`\`\`yml\nUptime: ${lavauptime}\nRAM: ${lavaram} / ${lavalloc}MB\nCPU: ${(lavacores === 1) ? "1 Core" : `${lavacores} Cores`}\nPlaying: ${lavaclientstats.playingPlayers} out of ${lavaclientstats.players}\n\`\`\``,
				}])
			}
		} else {
			statsEmbed.setDescription("**Lavalink manager was not initialized on startup, there are no nodes connected.**")
		}
		return interaction.reply({ embeds: [statsEmbed], ephemeral: true });
	},
};