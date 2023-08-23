// Constructing the client as a new class (refer to `./lib/Bot`)
const Bot = require('./lib/Bot');
const client = new Bot();
module.exports.getClient = () => client;
