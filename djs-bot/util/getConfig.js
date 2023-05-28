/**
 * Promise based module to get and return the contents of `config.js`
 * @returns {Promise<import("../config")>}
*/
module.exports = async () => {
	return new Promise((resolve, reject) => {
		try {
			const config = require("../config");
			resolve(config);
		} catch {
			reject("No config file found.\nMake sure it is filled in completely!");
		}
	}).catch(err => {
		console.log(err);
	});
};
