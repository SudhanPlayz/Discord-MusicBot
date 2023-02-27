/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */

const Auth = (req, res, next) => {
	if (!req.user) {
		return res.redirect("/login");
	} else {
		next();
	}
};

module.exports = Auth;
