const { Message } = require("discord.js");
const Bot = require("../../lib/Bot");
const controlChannel = require("../../util/controlChannel");

// node_modules\discord.js\typings\index.d.ts:3940
// @messageCreate: [message: Message];
/**
 * 
 * @param {Bot} client 
 * @param {Message} message 
 * @returns {Promise<Message<boolean>>}
 */
module.exports = async (client, messages) => {
	for (const [k, v] of messages)
		await controlChannel.handleMessageDelete(v);
};
