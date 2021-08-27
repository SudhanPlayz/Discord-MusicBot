let config;
try {
  //Config for testing
  config = require("../../dev-config");
} catch {
  //Config for production
  config = require("../../botconfig");
}

const Auth = (req, res, next) => {
  if (!req.user) return res.redirect(config.CallbackURL);
  else next();
};

module.exports = Auth;
