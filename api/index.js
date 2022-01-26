import express from "express";
import fs from "fs";
import { EventEmitter } from "events";
import { join, dirname as __dirname } from "path";
import getConfig from "../util/getConfig.js";
import DiscordMusicBot from "../lib/DiscordMusicBot.js";

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
    fs.readdir(join(__dirname("."), "api", "routes"), (err, files) => {
      if (err) return console.log(err);
      files.forEach(async (file) => {
        this.app.use(
          "/api/" + file.split(".")[0],
          await import("./"+join("routes", file)).then(file => file.default)
        );
      });
    });
  }

  listen() {
    this.app.listen(this.config.port);
  }
}

export default Server;
