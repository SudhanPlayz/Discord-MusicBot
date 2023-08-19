const SlashCommand = require("../lib/SlashCommand");
const { ccInteractionHook } = require("../util/interactions");
const { autoQueueEmbed } = require("../util/embeds");

const command = new SlashCommand()
	.setName("autoqueue")
	.setCategory("cc")
	.setDescription("Autoqueue interaction")
	.setRun(async (client, interaction, options) => {
		const { error, data } = await ccInteractionHook(client, interaction);

		if (error || !data || data instanceof Promise) return data;

		const { player, channel, sendError } = data;

		const autoQueue = player.get("autoQueue");
		player.set("requester", interaction.guild.members.me);

		if (!autoQueue || autoQueue === false) {
			player.set("autoQueue", true);
		} else {
			player.set("autoQueue", false);
		}

		const msg = await interaction
			.reply({ embeds: [autoQueueEmbed({autoQueue})], fetchReply: true })
			.catch(client.warn);

		setTimeout(() => msg?.delete().catch(client.warn), 20000);

		return msg;
	});

module.exports = command;
