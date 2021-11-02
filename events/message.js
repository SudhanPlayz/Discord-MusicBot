/**
 *
 * @param {require("../structures/DiscordMusicBot")} client
 * @param {require("discord.js").Message} message
 * @returns {void} aka: nothing ;-;
 */

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  let prefix = client.botconfig.DefaultPrefix;

  let GuildDB = await client.GetGuild(message.guild.id);
  if (GuildDB && GuildDB.prefix) prefix = client.botconfig.DefaultPrefix;

  //Initialize GuildDB
  if (!GuildDB) {
    await client.database.guild.set(message.guild.id, {
      prefix: client.botconfig.DefaultPrefix,
      DJ: client.botconfig.DJ,
    });
    GuildDB = await client.GetGuild(message.guild.id);
  }

  //Prefixes also have mention match
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  //Searching a command
  const cmd =
    client.commands.get(command) ||
    client.commands.find((x) => x.aliases && x.aliases.includes(command));

  const hasRole = vibeCheck();

  function vibeCheck() {
    message.member.roles.cache.forEach(set_hasRole);
    function set_hasRole(value, index, array) {
      if (GuildDB.DJ.includes(value)) return 1;
    }
    return 0;
  } //vibeCheck()
  console.log(hasRole);

  //Executing the codes when we get the command or aliases
  if (cmd) {
    if (
      cmd.name === "disconnect" ||
      cmd.name === "loop" ||
      cmd.name === "loopqueue" ||
      cmd.name === "skip" ||
      cmd.name === "skipto" ||
      cmd.name === "volume" ||
      cmd.name === "youtube" ||
      cmd.name == "config"
    ) {
      if (
        (cmd.permissions &&
          cmd.permissions.channel &&
          !message.channel
            .permissionsFor(client.user)
            .has(cmd.permissions.channel)) ||
        (cmd.permissions &&
          cmd.permissions.member &&
          !message.channel
            .permissionsFor(message.member)
            .has(cmd.permissions.member)) ||
        (cmd.permissions &&
          GuildDB.DJ &&
          !message.channel
            .permissionsFor(message.member)
            .has(["ADMINISTRATOR"]) &&
          !hasRole)
      )
        return client.sendError(
          message.channel,
          "Missing Permissions!" + GuildDB.DJ
            ? " You need the `DJ` role to access this command."
            : ""
        );
    }
    cmd.run(client, message, args, { GuildDB });
    client.CommandsRan++;
  } else return;
};
