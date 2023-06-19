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

async function getCommands() {
	return new Promise(async (resolve) => {
		let slash = await getCommandsDir();

		resolve({ slash });
	});
};

const getCommandsDir = () => {
	return new Promise((resolve) => {
		let commands = [];
		let CommandsDir = fs.readdirSync("./commands")
		let i = 0,
			f = getFiles("./commands").length,
			r = false;

		for (const category of CommandsDir) {
			fs.readdir(`./commands/${category}`, (error, files) => {
				if (error) throw error;
				files.forEach((file) => {
					let command = require(`../commands/${category}/${file}`);
					i++; if (i == f) r = true;
					if (!command)
						return console.log(`Failed to get file: ${file}`);
					commands.push(command);
					if (r) resolve(commands);
				});
			});
		}
	});
};

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
	getCommands,
	getFiles,
};
