// toggle "const voteskip=true" to enable/disable voteskip on discord js v12

const voteskip = true;

module.exports = {
  name: "togglevote",
  description: "Toggle voteskip",
  execute(message, args) {
    if (voteskip) {
      voteskip = false;
      message.channel.send("Voteskip is now disabled!");
    } else {
      voteskip = true;
      message.channel.send("Voteskip is now enabled!");
    }
  },
};
