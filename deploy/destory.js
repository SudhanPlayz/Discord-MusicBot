//Deletes every commands from every server yikes!!1!!11!!
const readline = require("readline");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const getConfig = require("../util/getConfig");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const config = await getConfig();
  const rest = new REST({ version: "9" }).setToken(config.token);

  rl.question(
    "Enter the guild id you wanted to delete commands: ",
    async (guild) => {
      console.log("Evil bot has been started to delete commands...");
      let commands = await rest.get(
        Routes.applicationGuildCommands(config.clientId, guild)
      );
      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        await rest
          .delete(
            Routes.applicationGuildCommand(config.clientId, guild, cmd.id)
          )
          .catch(console.log);
        console.log("Deleted command: " + cmd.name);
      }
      if (commands.length === 0)
        console.log("Evil bot doesn't seen any commands to delete :c");
      rl.close();
    }
  );
})();
