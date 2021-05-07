module.exports = (client, guild) => {
  require("../util/RegisterSlashCommands")(client, guild.id);
};
