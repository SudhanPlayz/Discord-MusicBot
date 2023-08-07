const SlashCommand = require("../../../lib/SlashCommand");

module.exports = new SlashCommand()
	.setName("config")
	.setCategory("utility")
	.setDBMS()
	.setDescription("Configure various bot settings")
	// !TODO: complete setUsage ?
	.setUsage("/config")
	// !TODO: implement run method
	.setRun(async (...args) => {
		console.log(args);
	});
