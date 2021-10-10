const api = require("express").Router();
const Auth = require("../Middlewares/AuthWebhook");
const { spawn } = require("child-process")

api.use(Auth);

api.post("/restart", async (req, res) => {
  res.status(300).send("Success");
  //todo: Restart the process somehow
  console.log("Restart webhook has pinged")
});

module.exports = api;
