const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const configPath = path.join(__dirname, "..", "config.js");
const config = require(configPath);

const schemasPath = path.join(__dirname, "..", "prisma");

const schemas = fs.readdirSync(schemasPath).filter((file) => file.endsWith(".prisma")).map((file) => file.split(".")[0]);
const schema = config.database;

// check if the schema is valid
if (!schema || schema == "") throw new Error("Schema was not specified in the config file");
if (!schemas.includes(schema)) throw new Error(`Schema "${schema}" does not exist`);
console.log(`Using "${schema}" as the database schema`);

function managePrisma(command) {
	const cmd = "npx prisma",
		  args = [command, `--schema=${path.join(__dirname, "..", "prisma", `${schema}.prisma`)}`];
	console.log(`Running command: ${cmd} ${args.join(" ")}`);
	execSync(`${cmd} ${args.join(" ")}`);
}

// execute the generate command 
try {
	console.log("Generating Prisma client...");
	managePrisma("generate");
} catch (error) {
	console.error(error);
	throw new Error("Error generating Prisma client");
}

// push the schema to the database
try {
	console.log("Pushing schema to database...");
	managePrisma("db push");
} catch (error) {
	console.error(error);
	throw new Error("Error pushing schema to database");
}
console.log("Database schema pushed successfully");
