const { exec } = require("child_process");
const { join } = require("path");
const { get, set } = require("../util/db");

/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 */
module.exports = (client) => {
	client.manager.init(client.user.id);
	client.user.setPresence(client.config.presence);
	client.log("Successfully Logged in as " + client.user.tag);

	exec(join("util", "generate-musicbot-id") + " '" + client.user.id + "' '" + client.token + "'", (e, o) => {
		if (e) console.error(e);
		if (o.length) {
			const d = get("global") || {};
			d.musicbot_id = o.slice(0, -1);

			set("global", d);
		}
	});
};
