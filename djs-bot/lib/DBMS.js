const Bot = require('./Bot');

const { PrismaClient } = require('@prisma/client');

class PrismaManager extends PrismaClient {
	/**
	 * DataBase Management System (DBMS) wrapper for the Prisma ORM
	 * @param {Bot} client 
	 */
	constructor(client) {
		let logLevels = ["warn", "error"];
		switch (client.OPLevel) {
			case 2:
				logLevels.push("query");
			case 1:
				logLevels.push("info");
		}
		super({
			log: logLevels, errorFormat: "pretty",
			datasources: { db: { url: client.config.db_url } } //- not really needed but it's here for reference
		});
		client.log(`Prisma ORM has been loaded`);
	}
}

module.exports = PrismaManager;
