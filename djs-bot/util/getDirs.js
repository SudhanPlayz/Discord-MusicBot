const fs = require("fs");

/**
 * Reads all files of a dir and sub dirs
 * @param {string} dir Directory to read
 * @param {Array<string>} files_ 
 * @returns {Array<string>} Array of files
 * @note Dunno where I found this function but I'm pretty sure it's not mine
 */
const getFiles = (dir, files_) => {
	files_ = files_ || [];
	let files = fs.readdirSync(dir);
	for (let i in files) {
		let name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
}

module.exports = {
	getFiles,
};
