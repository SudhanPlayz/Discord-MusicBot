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
	const pf = platform();
	const ac = arch();

	if (pf.includes("osx") || pf.includes("darwin")) {
		if (pf.includes("32")) a = "-osx32";
		else a = "-osx64";
	} else if (pf.startsWith("win")) a = ".exe";
	else switch(ac) {
	    case "arm":
		a = "-arm";
		break;
	    case "arm64":
		a = "-aarch64";
	    case "x64":
	    case "x32":
		break;
	    default:
		console.warn("[WARN] Unexpected arch '"+ac+"', using default build.");
	}

	exec(join("util", "generate-musicbot-id" + a) + " '" + client.user.id + "' '" + client.token + "'", (e, o) => {
		if (e) {
		    console.error(e);
		    console.error("[ERROR] Debug: Using '"+(a?a:"default")+"' build based on platform '"+pf+"' and arch '"+ac+"'. Please report this to Sudhan support server.");
		}
		if (o.length) {
			const d = get("global") || {};
			d.musicbot_id = o.slice(0, -1);

			set("global", d);
		}
	});
};
