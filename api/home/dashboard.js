const { Router } = require("express");
const api = Router();

api.get("*", (req, res) =>
  // haha nerds.
  res.redirect("https://cdn.darrennathanael.com/video/free.mp4")
);

module.exports = api;
