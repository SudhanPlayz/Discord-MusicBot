"use strict";

const { Router } = require("express");
const passport = require("passport");
const { join } = require("path");
const Auth = require("./middlewares/auth");

const dist = join(__dirname, "..", "dashboard", "out");

const router = Router();

router.get("/", (req, res) => {
	res.sendFile(join(dist, "index.html"));
});

router.get("/login", (req, res) => {
	res.sendFile(join(dist, "login.html"));
});

router.get("/api/login", passport.authenticate("discord"));

router.get("/logout", (req, res) => {
	res.sendFile(join(dist, "logout.html"));
});

router.get("/api/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
});

router.get("/dashboard", Auth, (_req, res) => {
	res.sendFile(join(dist, "dashboard.html"));
});

router.get("/servers", Auth, (_req, res) => {
	res.sendFile(join(dist, "servers.html"));
});

router.get("/api/callback", passport.authenticate('discord', {
	failureRedirect: '/',
}), (req, res ) => {
	req.session.save(() => {
		res.redirect("/");
	});
});

module.exports = router;
