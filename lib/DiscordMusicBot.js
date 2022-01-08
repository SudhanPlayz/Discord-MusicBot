const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  MessageActionRow,
  MessageButton,
  Interaction,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const prettyMilliseconds = require("pretty-ms");
const jsoning = require("jsoning"); // Documentation: https://jsoning.js.org/
const { Manager } = require("erela.js");
const ConfigFetcher = require("../util/getConfig");
const Logger = require("./Logger");
const spotify = require("better-erela.js-spotify").default;
const apple = require("erela.js-apple");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");
const Server = require("../api");
const getLavalink = require("../util/getLavalink");
const getChannel = require("../util/getChannel");
const colors = require("colors");
const filters = require("erela.js-filters");

require("./EpicPlayer");

class DiscordMusicBot extends Client {
  /**
   * Create the music client
   * @param {import("discord.js").ClientOptions} props - Client options
   */
  constructor(
    props = {
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    }
  ) {
    super(props);

    ConfigFetcher()
      .then((conf) => {
        this.config = conf;
        this.build();
      })
      .catch((err) => {
        throw Error(err);
      });

    //Load Events and stuff
    /**@type {Collection<string, import("./SlashCommand")} */
    this.slashCommands = new Collection();
    this.contextCommands = new Collection();

    this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

    this.LoadCommands();
    this.LoadEvents();

    this.database = new jsoning("db.json");

    this.getLavalink = getLavalink;
    this.getChannel = getChannel;
    this.ms = prettyMilliseconds;
  }

  /**
   * Send an info message
   * @param {string} text
   */
  log(text) {
    this.logger.log(text);
  }

  /**
   * Send an warning message
   * @param {string} text
   */
  warn(text) {
    this.logger.warn(text);
  }

  /**
   * Build em
   */
  build() {
    this.warn("Started the bot...");
    this.login(this.config.token);
    this.server = new Server(this); //constructing also starts it
    process.on("unhandledRejection", (error) => console.log(error));
    process.on("uncaughtException", (error) => console.log(error));

    let client = this;

    this.manager = new Manager({
      plugins: [
        new deezer(),
        new apple(),
        new spotify({
          clientId: this.config.spotify.clientId,
          clientSecret: this.config.spotify.clientSecret,
          playlistPageLimit: this.config.spotify.playlistPageLimit,
          albumPageLimit: this.config.spotify.albumPageLimit,
        }),
        new facebook(),
        new filters(),
      ],
      nodes: this.config.nodes,
      retryDelay: this.config.retryDelay,
      retryAmount: this.config.retryAmount,
      send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        this.log(
          `Node: ${node.options.identifier} | Lavalink node is connected.`
        )
      )
      .on("nodeReconnect", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node is reconnecting.`
        )
      )
      .on("nodeDestroy", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node is destroyed.`
        )
      )
      .on("nodeDisconnect", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node is disconnected.`
        )
      )
      .on("nodeError", (node, err) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}`
        )
      )
      .on("trackError", (player, track) =>
        this.warn(`Player: ${player.options.guild} | Track had an error.`)
      )
      .on("trackStuck", (player, track, threshold) =>
        this.warn(`Player: ${player.options.guild} | Track is stuck.`)
      )
      .on("playerMove", (player, oldChannel, newChannel) => {
        const guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        const channel = guild.channels.cache.get(player.textChannel);
        if (oldChannel === newChannel) return;
        if (newChannel === null || !newChannel) {
          if (!player) return;
          if (channel)
            channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(client.config.embedColor)
                  .setDescription(`Dsiconnected from <#${oldChannel}>`),
              ],
            });
          return player.destroy();
        } else {
          player.voiceChannel = newChannel;
          setTimeout(() => player.pause(false), 1000);
          return undefined;
        }
      })
      .on("playerCreate", (player) =>
        this.warn(
          `Player: ${
            player.options.guild
          } | A wild player has been created in ${
            client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "a guild"
          }`
        )
      )
      .on("playerDestroy", (player) =>
        this.warn(
          `Player: ${
            player.options.guild
          } | A wild player has been destroyed in ${
            client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "a guild"
          }`
        )
      )
      // on LOAD_FAILED send error message
      .on("loadFailed", (node, type, error) =>
        this.warn(
          `Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`
        )
      )
      // on TRACK_START send message
      .on("trackStart", async (player, track) => {
        this.warn(
          `Player: ${
            player.options.guild
          } | Track has been started playing [${colors.blue(track.title)}]`
        );

        let TrackStartedEmbed = this.Embed()
          .setAuthor({ name: "Now playing", iconURL: this.config.iconURL })
          //.setAuthor(`Now playing ♪`, this.config.iconURL)
          // .setTitle(track.title)
          // .setURL(track.uri)
          .setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
          .addField("Requested by", `${track.requester}`, true)
          // show the duration of the track but if it's live say that it's "LIVE" if it's not anumber say it's live, if it's null say it's unknown
          .addField(
            "Duration",
            track.isStream
              ? `\`LIVE\``
              : `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
            true
          );
        try {
          TrackStartedEmbed.setThumbnail(
            track.displayThumbnail("maxresdefault")
          );
        } catch (err) {
          TrackStartedEmbed.setThumbnail(track.thumbnail);
        }
        let NowPlaying = await client.channels.cache
          .get(player.textChannel)
          .send({
            embeds: [TrackStartedEmbed],
            components: [client.createController(player.options.guild)],
          })
          .catch(this.warn);
        player.setNowplayingMessage(NowPlaying);
      })
      .on("queueEnd", (player) => {
        this.warn(`Player: ${player.options.guild} | Queue has been ended`);
        let QueueEmbed = this.Embed()
          .setAuthor({
            name: "The queue has ended",
            iconURL: this.config.iconURL,
          })
          .setFooter({ text: "Queue ended at" })
          .setTimestamp();
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [QueueEmbed] });
        // check the config for how much time to wait before disconnecting the bot
        try {
          // make sure is a number if not set it to 0
          if (this.config.disconnectTime && !player.twentyFourSeven) {
            setTimeout(() => {
              // check if theres something playing
              if (!player.queue.current) {
                let DisconnectedEmbed = new MessageEmbed()
                  .setColor(this.config.embedColor)
                  .setAuthor({
                    name: "Disconnected",
                    iconURL: this.config.iconURL,
                  })
                  .setDescription(
                    `The player has been disconnected due to inactivity.`
                  );
                client.channels.cache
                  .get(player.textChannel)
                  .send({ embeds: [DisconnectedEmbed] });
                player.destroy();
              } else {
                this.warn(`Player: ${player.options.guild} | Still playing`);
              }
            }, this.config.disconnectTime);
          }
        } catch (err) {
          this.warn(err);
        }
      });
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  Embed(text) {
    let embed = new MessageEmbed().setColor(this.config.embedColor);

    if (text) embed.setDescription(text);

    return embed;
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  ErrorEmbed(text) {
    let embed = new MessageEmbed()
      .setColor("RED")
      .setDescription("❌ | " + text);

    return embed;
  }

  LoadEvents() {
    let EventsDir = path.join(__dirname, "..", "events");
    fs.readdir(EventsDir, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file);
          this.on(file.split(".")[0], event.bind(null, this));
          this.warn("Event Loaded: " + file.split(".")[0]);
        });
    });
  }

  LoadCommands() {
    let SlashCommandsDirectory = path.join(
      __dirname,
      "..",
      "commands",
      "slash"
    );
    fs.readdir(SlashCommandsDirectory, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          let cmd = require(SlashCommandsDirectory + "/" + file);

          if (!cmd || !cmd.run)
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have an valid command with run function"
            );
          this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("Slash Command Loaded: " + file.split(".")[0]);
        });
    });

    let ContextCommandsDirectory = path.join(
      __dirname,
      "..",
      "commands",
      "context"
    );
    fs.readdir(ContextCommandsDirectory, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          let cmd = require(ContextCommandsDirectory + "/" + file);
          if (!cmd.command || !cmd.run)
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have either command/run"
            );
          this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("ContextMenu Loaded: " + file.split(".")[0]);
        });
    });
  }

  /**
   *
   * @param {import("discord.js").TextChannel} textChannel
   * @param {import("discord.js").VoiceChannel} voiceChannel
   */
  createPlayer(textChannel, voiceChannel) {
    return this.manager.create({
      guild: textChannel.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: textChannel.id,
      selfDeafen: this.config.serverDeafen,
      volume: this.config.defaultVolume,
    });
  }

  createController(guild) {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`controller:${guild}:LowVolume`)
        .setEmoji("🔉"),

      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId(`controller:${guild}:Replay`)
        .setEmoji("◀"),

      new MessageButton()
        .setStyle("DANGER")
        .setCustomId(`controller:${guild}:PlayAndPause`)
        .setEmoji("⏯"),

      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId(`controller:${guild}:Next`)
        .setEmoji("▶"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`controller:${guild}:HighVolume`)
        .setEmoji("🔊")
    );
  }
}

module.exports = DiscordMusicBot;
