const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "invite",
    description: "To add/invite the bot to your server",
    usage: "[invite]",
    aliases: ["inv"],
  },

  run: async function (client, message, args) {
    let invite = new MessageEmbed()
    .setTitle(`Invite ${client.user.username}`)
    .setDescription(`Want me in your server? Invite me today! \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`)
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37080128&scope=bot`)
    .setColor("BLUE")
    return message.channel.send(invite);
  },
};
