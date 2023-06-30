/**
 * /commands route
 * returns the commands the bot has
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("../../../lib/Bot")} bot
 */
module.exports = (req, res, bot) => {
	res.status(200).json({
		commands: bot.slash.map(command => ({
			name: command.name,
			description: command.description,
		})),
	});
}