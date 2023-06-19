const fs = require('fs');
const express = require('express');

// https://expressjs.com/en/starter/installing.html
const app = express();
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
const routes = fs.readdirSync(__dirname + '/routes').filter(file => file.endsWith('.js'))
for (const file of routes) {
	router.use('/' + file.split('.')[0], require('./routes/' + file))
}
app.use('/api/v0', router)

module.exports = app