const DiscordMusicBot = require("./lib/DiscordMusicBot");
const { exec } = require("child_process");
const client = new DiscordMusicBot();

if (process.env.REPL_ID) {
	console.log("Replit system detected, initiating special `unhandledRejection` event listener | index.js:19")
	process.on('unhandledRejection', (reason, promise) => {
		promise.catch((err) => {
			if (err.status === 429) { 
				console.log("something went wrong while logging in, resetting..."); 
				exec("kill 1"); 
			}
		});
	}); 
}

console.log("Make sure to fill in the config.js before starting the bot.");

module.exports = client;
