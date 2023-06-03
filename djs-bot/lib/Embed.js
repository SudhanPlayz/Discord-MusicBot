const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');

const isButtonForUser = (returnValue, ...interaction) => {
	if (returnValue.user.id === interaction.user.id) return true;
	return returnValue.reply({
		embeds: [
			new MessageEmbed()
				.setColor("Red")
				.setDescription("This Button Isn't For You")
		],
		ephemeral: true
	});
};

const isSelectMenuForUser = (returnValue, ...interaction) => {
	return returnValue.user.id === interaction.user.id && returnValue.isSelectMenu();
};

/**
 * retro compatibility for v13
 */
class MessageActionRow extends ActionRowBuilder {
	constructor() {
		super();
	}
}

/**
 * retro compatibility for v13
 */
class MessageSelectMenu extends StringSelectMenuBuilder {
	constructor() {
		super();
	}
}

/**
 * retro compatibility for v13
 */
class MessageButton extends ButtonBuilder {
	constructor() {
		super();
	}
}

/**
 * retro compatibility for v13
 */
class MessageEmbed extends EmbedBuilder {
	/**
	 * @param {string} name
	 * @param {string} value
	 * @returns {MessageEmbed}
	 */
	addField(name, value) {
		this.addFields({ name, value });
		return this;
	}

	/**
	 * @param {Number} pageNo
	 * @param {Number} maxPages
	 * @returns {ActionRowBuilder}
	 */
	getButtons = (pageNo, maxPages) => {
		return new ActionRowBuilder().addComponents(
			new MessageButton()
				.setCustomId("previous_page")
				.setEmoji("◀️")
				.setStyle("Primary")
				.setDisabled(pageNo == 0),
			new MessageButton()
				.setCustomId("next_page")
				.setEmoji("▶️")
				.setStyle("Primary")
				.setDisabled(pageNo == (maxPages - 1)),
		);
	};
}

module.exports = { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton,
	isButtonForUser, isSelectMenuForUser };