const { MessageEmbed } = require("discord.js")

module.exports = async (client, message) => {

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        const embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("My prefix on this server is `/` (Slash Command). To get started you can type `/help` to see all my commands");

        message.channel.send({
            embeds: [embed]
        })
    };
};
