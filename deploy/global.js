import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import getConfig from "../util/getConfig.js";
import LoadCommands from "../util/loadCommands.js";

(async () => {
  const config = await getConfig();
  const rest = new REST({ version: "9" }).setToken(config.token);
  const commands = await LoadCommands().then((cmds) => {
    return [].concat(cmds.slash).concat(cmds.context);
  });

  console.log("Deploying commands to global...");
  await rest
    .put(Routes.applicationCommands(config.clientId), {
      body: commands,
    })
    .catch(console.log);
  console.log("Successfully deployed commands!");
})();
