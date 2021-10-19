const path = require("path")
const fs = require("fs")

const LoadCommands = () => {
  return new Promise((resolve) => {
    let commands = []
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
        if(cmd.Command.SlashCommand)commands.push(cmd.Command.SlashCommand)
        if(cmd.Command.ContextMenu)commands.push(cmd.Command.ContextMenu)
        if (r) resolve(commands);
      });
    });
  });
}

module.exports = LoadCommands;
