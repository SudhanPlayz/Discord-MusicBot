import readline from "readline";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import getConfig from "../util/getConfig";
import LoadCommands from "../util/loadCommands";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const config = await getConfig();
  const rest = new REST({ version: "9" }).setToken(config.token);
  const commands = await LoadCommands().then((cmds) => {
    return [].concat(cmds.slash).concat(cmds.context);
  });

  rl.question(
    "Enter the guild id you wanted to deploy commands: ",
    async (guild) => {
      console.log("Deploying commands to guild...");
      await rest
        .put(Routes.applicationGuildCommands(config.clientId, guild), {
          body: commands,
        })
        .catch(console.log);
      console.log("Successfully deployed commands!");
      rl.close();
    }
  );
})();
