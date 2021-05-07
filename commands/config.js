const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Edit the bot settings",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.config.IconURL)
      .setColor("RANDOM")
      .addField("Prefix", GuildDB.prefix, true)
      .addField("DJ Role", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Not Set", true)
      .setDescription(`
What would you like to edit?

:one: - Server Prefix
:two: - DJ Role
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      Config.setDescription(
        "You took too long to respond. Run the command again to edit the settings."
      );
      ConfigMessage.edit(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await message.channel.send("What do you want to change it to?");
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return message.channel.send("You took too long to respond.");
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      message.channel.send(
        "Successfully saved guild prefix as `" + prefix + "`"
      );
    } else {
      await message.channel.send(
        "Please mention the role you want `DJ's` to have."
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first())
        return message.channel.send("You took too long to respond.");
      role = role.first();
      if (!role.mentions.roles.first())
        return message.channel.send(
          "Please mention the role that you want for DJ's only."
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      message.channel.send(
        "Successfully saved guild prefix as <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "Prefix",
        description: "Check the bot's prefix",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Set the bot's prefix",
            type: 3,
            required: true,
          },
        ],
      },
      {
        name: "DJRole",
        description: "Check the DJ role",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "Set the DJ role",
            type: 8,
            required: true,
          },
        ],
      },
    ],

    run: async (client, interaction, args, { GuildDB }) => {
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          interaction.send(`The prefix has now been set to \`${prefix}\``);
        } else {
          //has not prefix
          interaction.send(`Prefix of the server is \`${GuildDB.prefix}\``);
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          interaction.send(
            `Successfully changed DJ role of this server to ${role.name}`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          interaction.send(`DJ Role of the server is ${role.name}`);
        }
      }
    },
  },
};
