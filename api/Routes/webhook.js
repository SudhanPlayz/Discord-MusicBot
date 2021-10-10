const api = require("express").Router();
const Auth = require("../Middlewares/AuthWebhook")

api.use(Auth)

api.post("/restart", async (req, res) => {
  console.log("wanted to restart")
  res.status(400).send("Test")
});

module.exports = api;
