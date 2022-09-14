const { exec } = require("child_process");
const { platform, arch } = require("os");
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
	let a = "";
	if (platform().includes("win")) a = ".exe";
	else switch(arch()) {
	    case "arm":
		a = "-arm";
		break;
	    case "arm64":
		a = "-aarch64";
	    case "x64":
	    case "x32":
		break;
	    default:
		console.warn("[WARN] Unexpected arch '"+arch()+"', using default build.");
	}

	exec(join("util", "generate-musicbot-id" + a) + " '" + client.user.id + "' '" + client.token + "'", (e, o) => {
		if (e) {
		    console.error(e);
		    console.error("[ERROR] Debug: Using '"+a+"' build based on platform '"+platform()+"' and arch '"+arch()+"'. Please report this to Sudhan support server.");
		}
		if (o.length) {
			const d = get("global") || {};
			d.musicbot_id = o.slice(0, -1);

			set("global", d);
		}
	});
};
