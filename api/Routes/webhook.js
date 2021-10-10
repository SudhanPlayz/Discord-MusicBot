const api = require("express").Router();
const Auth = require("../Middlewares/AuthWebhook")

api.use(Auth)

api.get("/", async (req, res) => {
  console.log("wanted to restart")
  res.status(400).send("Test")
});

module.exports = api;
