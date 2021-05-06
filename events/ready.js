module.exports = async (client) => {
  client.Ready = true;
  client.user.setActivity("Music", { type: "LISTENING" }).then(() => {
    client.Manager.init(client.user.id);
    client.log("Successfully Logged in as " + client.user.tag);
  });
  client.RegisterSlashCommands();
};
