const SlashCommand = require("../lib/SlashCommand");
const { embedNoLLNode, embedNoTrackPlaying } = require("../util/embeds");

const command = new SlashCommand()
	.setName("playpause")
	.setDescription("Play and Pause interaction")
	.setRun(async (client, interaction, options) => {
		if (!interaction.isButton()) {
			throw new Error("Invalid interaction type for this command");
		}

		const channel = await client.getChannel(client, interaction, {
			ephemeral: true,
		});

		if (!channel) {
			return;
		}

		const sendError = (embed) => {
			return interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		};

		if (!client.manager.Engine) {
			return sendError(embedNoLLNode());
		}

		const player = client.manager.Engine.players.get(interaction.guild.id);

		if (!player) {
			return sendError(embedNoTrackPlaying());
		}

		if (player.paused) {
			player.play();
		} else player.pause();

		interaction.deferUpdate();
		return;
	});

module.exports = command;
