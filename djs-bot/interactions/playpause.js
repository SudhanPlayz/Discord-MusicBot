const SlashCommand = require("../lib/SlashCommand");
const {
	embedNoLLNode,
	embedNoTrackPlaying,
} = require("../lib/embeds");

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

		if (!client.manager.Engine) {
			return interaction.reply({
				embeds: [embedNoLLNode()],
				ephemeral: true,
			});
		}

		const player = client.manager.Engine.players.get(interaction.guild.id);

		if (!player) {
			return interaction.reply({
				embeds: [embedNoTrackPlaying()],
				ephemeral: true,
			});
		}

		if (player.paused) {
			player.play();
		}
		else player.pause();

		interaction.deferUpdate();
		return;
	});

module.exports = command;
