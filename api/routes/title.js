const { Router } = require("express");
const api = Router();

// send title in json format
api.get("/", (req, res) => {
  res.json({
    name: "Discord Music Bot",
  });
});

module.exports = api;
