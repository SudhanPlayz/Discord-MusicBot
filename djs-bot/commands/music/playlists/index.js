const SlashCommand = require("../../../lib/SlashCommand");

module.exports = new SlashCommand()
	.setName("playlists")
	.setCategory("music")
	.setDBMS()
	.setDescription("Playlist management")
	.setUsage("/playlists [view | create | delete | add | remove | play]")
	.setRun(async function(...args) {
		return this.handleSubCommandInteraction(...args);
	})