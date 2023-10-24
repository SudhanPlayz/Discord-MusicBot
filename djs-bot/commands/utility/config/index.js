const SlashCommand = require("../../../lib/SlashCommand");

module.exports = new SlashCommand()
	.setName("config")
	.setCategory("utility")
	.setDBMS()
	.setDescription("Configure various bot settings")
	.setUsage("/config [dj-role | control-channel]")
	.setRun(async function(...args) {
		return this.handleSubCommandInteraction(...args);
	})
	.setPermissions(["Administrator"]);
