/**
 * /dashboard route
 * returns how many commands have been ran, The Users it has, and the Servers it is in and how many songs have been played
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("../../../lib/Bot")} bot
 */
module.exports = (req, res, bot) => {
	res.status(200).json({
		commandsRan: bot.commandsRan || 0,
		users: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
		servers: bot.guilds.cache.size,
		songsPlayed: bot.songsPlayed || 0,
	});
}