const { ActivityType } = require("discord.js");
const { capitalize, format } = require("../../util/string");
// this fires once on the bot being launched, sets the presence for the bot

// @ready: [client: Client<true>];
module.exports = (client) => {
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
	client.info("Successfully logged in as " + client.user.tag);
};