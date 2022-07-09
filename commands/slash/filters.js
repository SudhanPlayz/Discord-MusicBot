const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
	.setName("filters")
	.setDescription("add or remove filters")
	.addStringOption((option) =>
		option
			.setName("preset")
			.setDescription("the preset to add")
			.setRequired(true)
			.addChoices(
				{ name: "Nightcore", value: "nightcore" },
				{ name: "BassBoost", value: "bassboost" },
				{ name: "Vaporwave", value: "vaporwave" },
				{ name: "Pop", value: "pop" },
				{ name: "Soft", value: "soft" },
				{ name: "Treblebass", value: "treblebass" },
				{ name: "Eight Dimension", value: "eightD" },
				{ name: "Karaoke", value: "karaoke" },
				{ name: "Vibrato", value: "vibrato" },
				{ name: "Tremolo", value: "tremolo" },
				{ name: "Reset", value: "off" },
			),
	)
	
	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getString("preset");
		
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There's no music playing."),
				],
				ephemeral: true,
			});
		}
		
		// create a new embed
		let filtersEmbed = new MessageEmbed().setColor(client.config.embedColor);
		
		if (args == "nightcore") {
			filtersEmbed.setDescription("✅ | Nightcore filter is now active!");
			player.nightcore = true;
		} else if (args == "bassboost") {
			filtersEmbed.setDescription("✅ | BassBoost filter is now on!");
			player.bassboost = true;
		} else if (args == "vaporwave") {
			filtersEmbed.setDescription("✅ | Vaporwave filter is now on!");
			player.vaporwave = true;
		} else if (args == "pop") {
			filtersEmbed.setDescription("✅ | Pop filter is now on!");
			player.pop = true;
		} else if (args == "soft") {
			filtersEmbed.setDescription("✅ | Soft filter is now on!");
			player.soft = true;
		} else if (args == "treblebass") {
			filtersEmbed.setDescription("✅ | Treblebass filter is now on!");
			player.treblebass = true;
		} else if (args == "eightD") {
			filtersEmbed.setDescription("✅ | Eight Dimension filter is now on!");
			player.eightD = true;
		} else if (args == "karaoke") {
			filtersEmbed.setDescription("✅ | Karaoke filter is now on!");
			player.karaoke = true;
		} else if (args == "vibrato") {
			filtersEmbed.setDescription("✅ | Vibrato filter is now on!");
			player.vibrato = true;
		} else if (args == "tremolo") {
			filtersEmbed.setDescription("✅ | Tremolo filter is now on!");
			player.tremolo = true;
		} else if (args == "off") {
			filtersEmbed.setDescription("✅ | EQ has been cleared!");
			player.reset();
		} else {
			filtersEmbed.setDescription("❌ | Invalid filter!");
		}
		
		return interaction.reply({ embeds: [filtersEmbed] });
	});

module.exports = command;
