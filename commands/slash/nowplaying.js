// const SlashCommand = require("../../lib/SlashCommand");
// const { MessageEmbed } = require("discord.js");

// const command = new SlashCommand()
//   .setName("nowplaying")
//   .setDescription("Shows the currently playing song.")
//   .setRun(async (client, interaction, options) => {
//     let player = client.manager.players.get(interaction.guild.id);
//     if (!player) {
//       return interaction.reply({
//         embeds: [client.ErrorEmbed("Theres nothing playing")],
//       });
//     }
//     const embed = new MessageEmbed()
//       .setTitle(`Now Playing: ${player.queue}`)
//       .setURL(player.queue[0].url)
//       .setThumbnail(player.queue[0].thumbnail)
//       .setDescription(`Requested by: ${player.queue[0].requester}`)
//       .setFooter(`Duration: ${player.queue[0].duration}`);
// return interaction.reply({ embeds: [embed] });
// })
//     // interaction.reply({
//     //   embeds: [client.Embed(`Loop has been set to ${player.setTrackRepeat}`)],
//     // });

// module.exports = command;