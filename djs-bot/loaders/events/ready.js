const { ActivityType } = require("discord.js");
const { capitalize, format } = require("../../util/string");
const Bot = require("../../lib/Bot");
// this fires once on the bot being launched, sets the presence for the bot

/**
 *
 * @param {Bot} client
 */
module.exports = (client) => {
	clearTimeout(client.loginTimer);
	client.loginTimer = null;

	const activities = client.config.presence.activities;
	setInterval(() => {
		const index = Math.floor(Math.random() * activities.length);

		let data = {};
		try {
			data = activities[index].data(client);
		} catch (error) {}

		client.user.setActivity({
			name: format(activities[index].name, data),
			type: ActivityType[capitalize(activities[index].type)],
		});
	}, 10000);

	// Express API
	client.api.listen({ host: "0.0.0.0", port: client.config.api.port }, (err, address) => {
		if (err) {
			client.error("Can't start API:");
			client.error(err);
			return;
		}

		client.info(`API is now listening on port ${client.config.api.port}`);
	});

	client.wsServer.listen(client.config.ws.port, (sock) => {
		if (sock) {
			client.info(`WS is now listening on port ${client.config.ws.port}`);
			return;
		}

		client.error(new Error("Can't start WS"));
	});

	client.info("Successfully logged in as " + client.user.tag);
};
