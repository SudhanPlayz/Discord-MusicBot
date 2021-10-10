let config;
try {
  //Config for testing
  config = require("../../dev-config");
} catch {
  //Config for production
  config = require("../../botconfig");
}

const Auth = (req, res, next) => {
    if(!req.query.code || req.query.code !== config.WebhookSecret) {
        return res.status(401).send({
            message: "You are not authorized"
        });
    }
    next()
};
  
module.exports = Auth;