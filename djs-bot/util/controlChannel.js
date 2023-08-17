const { Message } = require("discord.js");
const { getClient } = require("../bot");
const { controlChannelMessage } = require("./embeds");

const controlChannelMessageCache = new Map();

const getControlChannelMessage = async (guildId) => {
	if (!guildId) throw new Error("No guild Id provided");

	const cache = controlChannelMessageCache.get(guildId);
	if (cache) return cache;

	const client = getClient();

	if (!client.db) throw new Error("No database configured");

	const { controlChannelId, controlChannelMessageId } =
		(await client.db.guild.findFirst({
			where: {
				guildId,
			},
		})) || {};

	if (!controlChannelId || !controlChannelMessageId) return null;

	const message = new Message(client, {
		id: controlChannelMessageId,
		channel_id: controlChannelId,
	});

	controlChannelMessageCache.set(guildId, message);

	return message;
};

const setDbControlChannel = async ({
	guildId,
	channelId,
	messageId,
} = {}) => {
	if (!guildId) throw new Error("No guildId provided");

	const client = getClient();

	if (!client.db) throw new Error("No db configured");

	await client.db.guild.upsert({
		where: {
			guildId,
		},
		create: {
			controlChannelId: channelId,
			guildId,
			controlChannelMessageId: messageId,
		},
		update: {
			controlChannelId: channelId,
			controlChannelMessageId: messageId,
		},
	});
};

// handle control message delete
// the only way to recreate message is running `/config control-channel`
// command again
const handleMessageDelete = async (message) => {
	const guildId = message.guildId;

	const savedMessage = await getControlChannelMessage(guildId);

	if (!savedMessage || (savedMessage.id !== message.id) || ((savedMessage.channelId !== message.channelId)))
		return;

	controlChannelMessageCache.delete(guildId);

	const client = getClient();

	if (!client.db) throw new Error("No database configured");

	await client.db.guild.update({
		where: {
			controlChannelId: message.channelId,
			controlChannelMessageId: message.id,
			guildId,
		},
		data: {
			controlChannelMessageId: null,
		},
	});
};

const updateControlMessage = async (guildId, track) => {
	const message = await getControlChannelMessage(guildId);

	if (!message) throw new Error("Guild doesn't have control channel");

	return message.edit(controlChannelMessage({ guildId, track }));
};

module.exports = {
	handleMessageDelete,
	getControlChannelMessage,
	updateControlMessage,
	setDbControlChannel,
};
