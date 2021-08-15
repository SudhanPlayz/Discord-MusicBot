module.exports = async (client) => {
  client.Ready = true, 
  client.user.setPresence({
    status: "online",  // You can show online, idle, and dnd
    activity: {
        name: "your fav songs :D | miko help",  // The message shown
        type: "PLAYING", // PLAYING, WATCHING, LISTENING, STREAMING,
    }
});
    client.Manager.init(client.user.id);
    client.log("Successfully Logged in as " + client.user.tag); // You can change the text if you want, but DO NOT REMOVE "client.user.tag"
client.RegisterSlashCommands();
};

