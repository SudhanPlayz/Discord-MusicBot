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

    //Stuff
    fs.readdir(join(__dirname, "routes"), (err, files) => {
      if (err) return console.log(err);
      files.forEach((file) => {
        this.app.use(
          "/api/" + file.split(".")[0],
          require(join(__dirname, "routes") + "/" + file)
        );
      });
    });
  }

  listen() {
    this.app.listen(this.config.port);
  }
}

module.exports = Server;
