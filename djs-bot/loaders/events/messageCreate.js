const { EmbedBuilder, Message } = require("discord.js");
const Bot = require("../../lib/Bot");
const { handleMessageCreate } = require("../../util/controlChannelEvents");

// node_modules\discord.js\typings\index.d.ts:3940
// @messageCreate: [message: Message];
/**
 *
 * @param {Bot} client
 * @param {Message} message
 * @returns {Promise<Message<boolean>>}
 */
module.exports = async (client, message) => {
	const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
	// Checks if, on every message sent in a server in which the bot is in, the bot is being mentioned and
	// determines if it should behave in a manner or another according to if the user is a bot dev or not
	if (message.content.match(mention)) {
		let timeout;
		let embed = new EmbedBuilder().setColor(client.config.embedColor);
		if (client.config.ownerId.includes(message.author.id)) {
			timeout = 10000;
			embed.setTitle("Reinvite").setURL(
				`https://discord.com/oauth2/authorize?client_id=${
					client.config.clientId
				}&permissions=${
					client.config.permissions
				}&scope=${client.config.scopes.toString().replace(/,/g, "%20")}`
			);
		} else {
			timeout = 15000;
			embed.setDescription(
				`To use my commands use the \`/\` (Slash Command).\nTo see a list of the available commands type \`/help\`.\nIf you can't see the list, make sure you're using me in the appropriate channels. If you have trouble please contact a server Mod.`
			).setThumbnail(`${client.config.iconURL}`);
		}
		embed.setFooter({ text: `Message will be deleted in ${timeout / 1000} seconds` });
		return message.channel
			.send({ embeds: [embed], ephemeral: true })
			.then((msg) => setTimeout(() => msg.delete(), timeout));
	}

	handleMessageCreate(message);
};
