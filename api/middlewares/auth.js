/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */

const Auth = (req, res, next) => {
	console.log("Middleware", req.user)
	if (!req.user) {
		return res.redirect("/login");
	} else {
		next();
	}
};

module.exports = Auth;