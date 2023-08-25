const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.js");
const config = require(configPath);

if (!config.database) {
	console.error("Database choice not specified in config.js");
	process.exit(1);
}

const chosenSchemaFileName = `${config.database}.prisma`;
const schemaFilePath = path.join(__dirname, "..", "prisma", chosenSchemaFileName);
const targetSchemaFilePath = path.join(__dirname, "..", "prisma", "schema.prisma");

try {
	fs.copyFileSync(schemaFilePath, targetSchemaFilePath);
	console.log(`Using ${chosenSchemaFileName} as schema.prisma`);
} catch (error) {
	console.error("Error copying schema file:", error);
	process.exit(1);
}
