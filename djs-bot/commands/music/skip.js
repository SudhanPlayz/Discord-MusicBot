const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("../../lib/Embed");
const playerUtil = require("../../util/player");
const { redEmbed } = require("../../util/embeds");

const command = new SlashCommand()
	.setName("skip")
	.setDescription("Skip the current song")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}

		let player;
		if (client.manager.Engine) {
			player = client.manager.Engine.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("Red")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}

		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("Red")
						.setDescription("There is nothing to skip."),
				],
				ephemeral: true,
			});
		}

		const song = player.queue.current;

		const status = playerUtil.skip(player);

		if (status === 1) {
			return interaction.reply({
				embeds: [
					redEmbed(
						`There is nothing after [${song.title}](${song.uri}) in the queue.`
					),
				],
			});
		}

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("✅ | **Skipped!**"),
			],
		});
	});

module.exports = command;
