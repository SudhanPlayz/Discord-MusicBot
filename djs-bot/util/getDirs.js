const fs = require("fs");

function getCategories() {
	let categories = [];
	let CommandsDir = fs.readdirSync("./commands");

	try {
		for (const category of CommandsDir) {
			categories.push({category: category, commands: []});
			const categoryLink = categories.find(c => c.category == category);
			for (const file of fs.readdirSync("./commands/" + categoryLink.category)) {
				categoryLink.commands.push({
					commandName: file.split(".")[0] || file.toString(), 
					fileObject: require(`../commands/${categoryLink.category}/${file}`) || null,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
	return categories;
}

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
	getCategories,
	getFiles,
};
