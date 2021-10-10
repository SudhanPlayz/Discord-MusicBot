const api = require("express").Router();
const Auth = require("../Middlewares/AuthWebhook");

api.use(Auth);

api.post("/restart", async (req, res) => {
  res.status(400).send("Success");

  if (process.env.process_restarting) {
    delete process.env.process_restarting;
    // Give old process one second to shut down before continuing ...
    setTimeout(main, 1000);
    return;
  }

  // Restart process ...
  spawn("git", "pull", "&&", process.argv[0], process.argv.slice(1), {
    env: { process_restarting: 1 },
    stdio: "ignore",
  }).unref();
});

module.exports = api;
