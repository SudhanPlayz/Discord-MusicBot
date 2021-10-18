const { Collection } = require("discordjs");

let collection = new Collection();

function LoadCommands() {
  return new Promise((resolve) => {
    let CommandsDir = path.join(__dirname, "..", "commands");
    let i = 0,
      f = 0,
      r = false;

    fs.readdir(CommandsDir, (err, files) => {
      if (err) throw err;
      f = files.length;

      files.forEach((file) => {
        let cmd = require(CommandsDir + "/" + file);
        i++;
        if (i == f) r = true;
        if (
          !cmd.Properties ||
          !cmd.Command ||
          (!cmd.Command.SlashCommand && !cmd.Command.ContextMenu)
        )
          return console.log(
            "Unable to load Command: " +
              file.split(".")[0] +
              ", File doesn't have either name/desciption or an command to run"
          );
        collection.set(file.split(".")[0].toLowerCase(), cmd);
        if (r) resolve(collection);
      });
    });
  });
}

module.exports = LoadCommands;
