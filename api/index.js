const express = require("express");
const fs = require("fs");
const { EventEmitter } = require("events");
const { join } = require("path");
const session = require("express-session");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
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

    // Session and Passport
    passport.use(
      new DiscordStrategy(
        {
          clientID: client.config.clientId,
          clientSecret: client.config.clientSecret,
          callbackURL: client.config.website + "/api/callback",
          scope: client.config.scopes.filter(a => !a.startsWith("app")).join(" "),
        },
        function (accessToken, refreshToken, profile, done) {
          process.nextTick(function () {
            return done(null, profile);
          });
        }
      )
    );

    api.use(
      session({
        secret: client.config.cookieSecret,
        resave: false,
        saveUninitialized: false,
      })
    );

    api.use(passport.initialize());
    api.use(passport.session());

    api.get(
      "/api/callback",
      passport.authenticate("discord", {
        failureRedirect: "/",
      }),
      function (req, res) {
        res.redirect("/dashboard");
      }
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });
  }

  listen() {
    this.app.listen(this.config.port);
  }
}

module.exports = Server;
