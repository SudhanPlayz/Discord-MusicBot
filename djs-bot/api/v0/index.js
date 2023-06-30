const fs = require('fs');
const cors = require('cors');
const express = require('express');
const Bot = require('../../lib/Bot');

// https://expressjs.com/en/starter/installing.html
const app = express();
app.use(cors());
app.get('/', (req, res) => {
	res.status(200).json({
		message: "Systems Operational!",
		version: require("../../package.json").version,
	});
});

// It will load all the routes from the `./routes` folder
// and will mount them on the `/api/v0` path
// So, for example, if you have a route in `./routes/test.js`
// it will be mounted on `/api/v0/test`
// read https://expressjs.com/en/guide/routing.html for more info
const router = express.Router()

/**
 * Constructs and mounts the API on to the Bot instance provided
 * @param {Bot} bot 
 */
module.exports = (bot) => {
	const routes = fs.readdirSync(__dirname + '/routes').filter(file => file.endsWith('.js'))
	for (const file of routes) {
		const route = require('./routes/' + file);
		router.use('/' + file.split('.')[0], (req, res) => route(req, res, bot))
	}
	app.use('/api/v0', router)

	return app;
}
