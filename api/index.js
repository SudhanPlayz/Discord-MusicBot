const express = require("express");
const fs = require("fs");
const { EventEmitter } = require("events");
const { join } = require("path");
const getConfig = require("../util/getConfig");
const DiscordMusicBot = require("../lib/DiscordMusicBot");

class Server extends EventEmitter {
  /**
   * Create server ;-;
   * @param {DiscordMusicBot} client
   */
  constructor(client) {
    super();
    getConfig()
      .then((conf) => {
        this.config = conf;
        this.listen();
      })
      .catch((err) => {
        throw Error(err);
      });

    this.app = express();

    //API
    fs.readdir(join(__dirname, "routes"), (err, files) => {
      if (err) return console.log(err);
      files.forEach((file) => {
        this.app.use(
          "/api/" + file.split(".")[0],
          require(join(__dirname, "routes") + "/" + file)
        );
      });
    });
    
    this.app.use(express.static(join(__dirname, "..", "public")));

    //Static Routes
    let dist = express.static(join(__dirname, "..", "dashboard", "out"))

    this.app.use(dist);
    this.app.get("/login", (_req, res) => {
      res.sendFile(join(dist, "login.html"));  
    });
    this.app.get("/logout", (_req, res) => {
      res.sendFile(join(dist, "logout.html"));  
    });
    this.app.get("/dashboard", (_req, res) => {
      res.sendFile(join(dist, "dashboard.html"));  
    });
    this.app.get("/servers", (_req, res) => {
      res.sendFile(join(dist, "servers.html"));  
    });
  }

  listen() {
    this.app.listen(this.config.port);
  }
}

module.exports = Server;
