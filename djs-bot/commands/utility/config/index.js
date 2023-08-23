const SlashCommand = require("../../../lib/SlashCommand");

module.exports = new SlashCommand()
	.setName("config")
	.setCategory("utility")
	.setDBMS()
	.setDescription("Configure various bot settings")
	// !TODO: complete setUsage ?
	.setUsage("/config")
	.setRun(async function(...args) {
		return this.handleSubCommandInteraction(...args);
	})
	.setPermissions(["Administrator"]);
