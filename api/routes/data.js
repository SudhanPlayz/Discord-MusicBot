const { Router } = require("express");
const api = Router();

const package = require("../../package.json");
const client = require("../../")

api.get("/", (req, res) => {
  res.json({
    name: package.name,
    version: package.version,
    commands: client.commands.map(cmd => {
      return {
        name: cmd.name,
        description: cmd.description
      }
    })
  });
});

module.exports = api;
