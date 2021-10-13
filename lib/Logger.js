const winston = require("winston");
const colors = require("colors");

class Logger {
  constructor(file) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename: file })],
    });
  }

  log(Text) {
    let d = new Date();
    this.logger.log({
      level: "info",
      message:
        `${d.getHours()}:${
          d.getMinutes
        } - ${d.getDate()}:${d.getMonth()}:${d.getFullYear()} | Info: ` + Text,
    });
    console.log(
      colors.green(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
      ) + colors.yellow(" | Info: " + Text)
    );
  }

  warn(Text) {
    let d = new Date();
    this.logger.log({
      level: "warn",
      message:
        `${d.getHours()}:${
          d.getMinutes
        } - ${d.getDate()}:${d.getMonth()}:${d.getFullYear()} | Warn: ` + Text,
    });
    console.log(
      colors.yellow(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
      ) + colors.green(" | Warn: " + Text)
    );
  }
}

module.exports = Logger;
