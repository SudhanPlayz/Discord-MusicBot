// Main file that initializes everything, sets up the shard manager and initializes everything from the `bot.js`
// https://discordjs.guide/sharding/
// https://discord.com/developers/docs/topics/gateway#sharding
// This is just the shard manager, the actual client is in `bot.js`
// All this isn't really necessary if the bot resides in less than 2000 servers, it was just a 
// proof of concept to help the user to understand sharding as well as how to set it up
//
// Bots, even without shard manager, reside on the 0 indexed shard either way
// If you want to remove sharding just delete this file (or move it to the assets folder) 
// and rename `bot.js` to `index.js`

const colors = require("colors");
const getConfig = require("./util/getConfig");
const { ShardingManager } = require('discord.js');

try {
	// Gets the config file and passes it (as if returned) to the function in `.then( () => {} )`
	getConfig().then((conf) => {
		const manager = new ShardingManager('./bot.js', { token: conf.token, respawn: true, totalShards: "auto", timeout: -1 });
		manager.on('shardCreate', shard => {
			let d = new Date();
			let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
			console.log(colors.gray(time) + colors.cyan(" | " + `Spawned shard ${shard.id}`));
		});
		manager.spawn({ amount: "auto", delay: 5500, timeout: -1 }).catch((err) => {
			console.log(colors.red("\tError spawning shards: " + err));
		});
	})
} catch (err) {
	console.log(colors.red("Error: " + err));
}
