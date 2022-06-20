const { Router } = require("express");
const api = Router();

const package = require("../../package.json");
const client = require("../../")

api.get("/", (req, res) => {
  let data = {
    name: package.name,
    version: package.version,
    commands: client.slashCommands.map(cmd => {
      return {
        name: cmd.name,
        description: cmd.description
      }
    })
  }
  res.json(data)
});

module.exports = api;
