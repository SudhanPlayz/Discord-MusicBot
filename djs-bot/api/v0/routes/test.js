/**
 * Test route
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = (req, res) => {
	res.status(200).json({
		message: "You are in /api/v0/test",
	});
}