const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = async (client, message) => {
    const mention = new RegExp(`^<@!?${ client.user.id }>( |)$`);
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.config.clientId}&permissions=${client.config.permissions}&scope=${client.config.scopes.toString().replace(/,/g, '%20')}`;

    const buttons = new MessageActionRow()
	.addComponents(
      new MessageButton()
		.setStyle("LINK")
		.setLabel('Invite me')
		.setURL(invite),
      new MessageButton()
  		.setStyle("LINK")
		.setLabel('Support server')
		.setURL(`${client.config.supportServer}`),
                      );
	
	if (message.content.match(mention)) {
		const mentionEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(
				`My prefix on this server is \`/\` (Slash Command).\nTo get started you can type \`/help\` to see all my commands.\nIf you can't see it, Please [re-invite](invite) me with the correct permissions.`,
			);
		
		message.channel.send({
			embeds: [mentionEmbed],
			components: [buttons],
		});
	}
};
