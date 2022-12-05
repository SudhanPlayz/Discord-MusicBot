const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");
const { forEach } = require("lodash");

const command = new SlashCommand()
	.setName("guildleave")
	.setDescription("leaves a guild")
    .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter the guild id to leave (type `list` for guild ids)")
      .setRequired(true)
  )
  .setRun(async (client, interaction, options) => {
		if (interaction.user.id === client.config.adminId) {
		    try{
			const id = interaction.options.getString('id');

			if (id.toLowerCase() === 'list'){
			    client.guilds.cache.forEach((guild) => {
				console.log(`${guild.name} | ${guild.id}`);
			    });
			    const guild = client.guilds.cache.map(guild => ` ${guild.name} | ${guild.id}`);
			    try{
				return interaction.reply({content:`Guilds:\n\`${guild}\``, ephemeral: true});
			    }catch{
				return interaction.reply({content:`check console for list of guilds`, ephemeral: true});
			    }
			}

			const guild = client.guilds.cache.get(id);

			if(!guild){
			    return interaction.reply({content: `\`${id}\` is not a valid guild id`, ephemeral:true});
			}

			await guild.leave().then(c => console.log(`left guild ${id}`)).catch((err) => {console.log(err)});
			return interaction.reply({content:`left guild \`${id}\``, ephemeral: true});
		    }catch (error){
			console.log(`there was an error trying to leave guild ${id}`, error);
		    }
		}else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("You are not authorized to use this command!"),
				],
				ephemeral: true,
			});
		}
	});

module.exports = command;
