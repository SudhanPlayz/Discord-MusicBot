const fs = require('fs');
const readline = require("readline");
const { spawnSync } = require("child_process");

/**
 * checks if a directory exists
 * @param {string} directory 
 */
 function dirExists(dir) {
	try {
		fs.readdirSync(dir);
	} catch (err) {
		if (err) return false;
	}
	return true;
}

/**
 * command line interface for the script
 */
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Runs a command through spawn and displays the output directly to the console.
 * Options are normalized to allow for EoA
 * 
 * @param {string} command command to execute through the shell using `child_process.spawnSync`
 * @param {string[]} argv arguments to pass to the command
 */
 function run(command, argv) {
	spawnSync(command, argv, {
		stdio: "inherit", // display output directly to the console (Live)
		shell: true, // runs the command through the shell (This option is required for the command to run through on any shell)
		cwd: process.cwd(), // sets the current working directory to the project root (Arbitrary)
		env: process.env // sets the environment variables to the system PATH (Arbitrary)
	});
	console.log("Done!");
};

const permissionsConfigMessageMapper = (perm) =>
	(typeof perm === "object") ? `${perm.permission}${perm.message?.length ? ` (${perm.message})` : ""}` : perm;

module.exports = {
	dirExists,
	run,
	rl,
	permissionsConfigMessageMapper,
};
