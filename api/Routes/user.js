const { Permissions } = require("discord.js");
const client = require("../../");
const api = require("express").Router();

api.get("/", async (req, res) => {
  if (!req.user) return res.send({});
  req.user.guilds.map((g) => {
    g.hasPerms = new Permissions(g.permissions).has("MANAGE_GUILD", true);
    g.inGuild = client.guilds.cache.has(g.id);
    return g;
  });
  res.send({ user: req.user });
});

module.exports = api;
