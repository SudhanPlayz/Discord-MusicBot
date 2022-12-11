const express = require("express");
const fs = require("fs");
const { EventEmitter } = require("events");
const { join } = require("path");
const session = require("express-session");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const getConfig = require("../util/getConfig");
const DiscordMusicBot = require("../lib/DiscordMusicBot");
const router = require("./router");

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

class Server extends EventEmitter {
	/**
	 * Create server ;-;
	 * @param {DiscordMusicBot} client
	 */
	constructor(client) {
		super();
		this.client = client;
		getConfig().then(this.init.bind(this));
	}

	init(conf) {
		this.config = conf;
		this.app = express();
		
		this.app.use(express.static(join(__dirname, "..", "public")));
		
		// Static Routes for scripts
		const dist = join(__dirname, "..", "dashboard", "out", "_next")
		
		this.app.use("/_next", express.static(dist));

		// Session and Passport
		this.app.use(session({
			resave: false,
			saveUninitialized: false,
			secret: this.config.cookieSecret,
			cookie: {
				secure: this.config.website.startsWith("https://"),
				sameSite: true,
			},
		}));

		this.initPassport();

		this.app.use(router);

		//API
		fs.readdir(join(__dirname, "routes"), (err, files) => {
			if (err) {
				return console.log(err);
			}
			files.forEach((file) => {
				this.app.use(
					"/api/" + file.split(".")[0],
					require(join(__dirname, "routes") + "/" + file),
				);
			});
		});

		this.listen();
	}
	
	initPassport() {
		this.app.use(passport.initialize());

		const strategy = new DiscordStrategy(
			{
				clientID: this.config.clientId,
				clientSecret: this.config.clientSecret,
				callbackURL: this.config.website + "/api/callback",
				scope: this.config.scopes.filter(a => !a.startsWith("app")),
				scopeSeparator: " ",
			},
			function (accessToken, refreshToken, profile, done) {
				const data = {
					accessToken,
					refreshToken,
					profile,
				};

				return done(null, data);
			},
		);
		passport.use(strategy);

		this.app.use(passport.session());
	}

	listen() {
		this.app.listen(this.config.port);
		console.log("[SERVER] Listening on port:", this.config.port);
	}
}

module.exports = Server;
