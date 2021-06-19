const { Command } = require('discord.js-commando');
const { MessageEmbed, Message } = require('discord.js');
const { SlashCommand } = require('./grab');
const { users } = require('node-os-utils');

module.exports = {
      name: 'avatar',
      description: "Responds with a user's avatar.",
      usage: "",
      permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
      },
      aliases: ['profile-picture', 'profile-pic', 'pfp', 'av'],
      /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

  run: async (message) => {
    console.log("Avatar command has been used")
    const user = message.mentions.users.first() || message.author;
    const embed = new MessageEmbed()
      .setTitle(user.tag)
      .setImage(user.avatarURL({ dynamic: true }))
      .setColor(0x00ae86);
    message.embed(embed);
    
    return;
  },
  SlashCommand: {
    options: [
        {
            name: "avatar",
            description: `Please provide a bassboost level. Available Levels: low, medium, high, or none`,
            value: "[level]",
            type: 3,
            required: false,
        },
    ],
  },
  /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

   run: async (message) => {
    const user = message.mentions.users.first() || message.author;
    const embed = new MessageEmbed()
      .setTitle(user.tag)
      .setImage(user.avatarURL({ dynamic: true }))
      .setColor(0x00ae86);
    message.embed(embed);
    return;
  },
};
