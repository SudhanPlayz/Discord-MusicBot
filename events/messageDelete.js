/**
 * On messageDelete events, adds the message to a WeakSet within the bot's client
 * allowing for the bot to easily see which messages have been deleted asynchronously
 * during the run time of the bot
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
	if (!client.isMessageDeleted(message)) {
		client.markMessageAsDeleted(message);
	}
};
