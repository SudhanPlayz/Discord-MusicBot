require("dotenv").config();
const DiscordMusicBot = require("./structures/DiscordMusicBot");
const { exec } = require("child_process");
const client = new DiscordMusicBot();

if (process.env.REPL_ID) {
  console.log(
    "Replit system detected, initiating special `unhandledRejection` event listener"
  );
  process.on("unhandledRejection", (reason, promise) => {
    promise.catch((err) => {
      if (err.status === 429) {
        exec("kill 1");
      }
    });
  });
}

client.build();

module.exports = client; //;-;
