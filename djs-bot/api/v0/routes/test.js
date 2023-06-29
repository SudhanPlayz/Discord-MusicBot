/**
 * Test route
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("../../../lib/Bot")} bot
 */
module.exports = (req, res, bot) => {
	res.status(200).json({
		message: "You are in /api/v0/test",
		bot: bot.denom,
	});
}