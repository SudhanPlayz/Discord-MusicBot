const fs = require('fs');
const { exit } = require('process');
const { run, dirExists } = require("../util/common");

// synchronously runs the script directly on the console
(() => {
	fs.rmSync("./package-lock.json", { force: true });

	if (dirExists("./node_modules")) {
		console.log("Cleaning node_modules...");
		run("npm", ["cache", "clean", "--force"]);
		fs.rmSync("./node_modules", { recursive: true, force: true });
	}
	
	console.log("Updating and saving dependencies to package.json...");
	run("npm", ["update", "--save"]);

	console.log("Installing dependencies...");
	run("npm", ["install"]);

	exit();
})();