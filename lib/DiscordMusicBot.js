const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const escapeMarkdown = require('discord.js').Util.escapeMarkdown;
const fs = require("fs");
const path = require("path");
const prettyMilliseconds = require("pretty-ms");
const jsoning = require("jsoning"); // Documentation: https://jsoning.js.org/
const { Manager } = require("erela.js");
const ConfigFetcher = require("../util/getConfig");
const Logger = require("./Logger");
const spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");
const Server = require("../api");
const getLavalink = require("../util/getLavalink");
const getChannel = require("../util/getChannel");
const colors = require("colors");
const filters = require("erela.js-filters");
const { default: EpicPlayer } = require("./EpicPlayer");
class DiscordMusicBot extends Client {
  /**
   * Create the music client
   * @param {import("discord.js").ClientOptions} props - Client options
   */
  constructor(
    props = {
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    }
  ) {
    super(props);

    ConfigFetcher().then((conf) => {
      this.config = conf;
      this.build();
    });

    //Load Events and stuff
    /**@type {Collection<string, import("./SlashCommand")} */
    this.slashCommands = new Collection();
    this.contextCommands = new Collection();

    this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

    this.LoadCommands();
    this.LoadEvents();

    this.database = new jsoning("db.json");

    this.deletedMessages = new WeakSet();
    this.getLavalink = getLavalink;
    this.getChannel = getChannel;
    this.ms = prettyMilliseconds;
    this.commandsRan = 0;
    this.songsPlayed = 0;
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
   * Send an error message
   * @param {string} text
   */
  error(text) {
    this.logger.error(text);
  }

  /**
   * Build em
   */
  build() {
    this.warn("Started the bot...");
    this.login(this.config.token);
    this.server = this.config.website?.length ? new Server(this) : null; // constructing also starts it; Do not start server when no website configured
    if (this.config.debug === true) {
      this.warn("Debug mode is enabled!");
      this.warn("Only enable this if you know what you are doing!");
      process.on("unhandledRejection", (error) => console.log(error));
      process.on("uncaughtException", (error) => console.log(error));
    } else {
      process.on("unhandledRejection", (error) => {
        return;
      });
      process.on("uncaughtException", (error) => {
        return;
      });
    }

    let client = this;

    /**
     * will hold at most 100 tracks, for the sake of autoqueue
     */
    let playedTracks = [];

    this.manager = new Manager({
      plugins: [
        new deezer(),
        new AppleMusic(),
        new spotify(),
        new facebook(),
        new filters(),
      ],
      autoPlay: true,
      nodes: this.config.nodes,
      retryDelay: this.config.retryDelay,
      retryAmount: this.config.retryAmount,
      clientName: `DiscordMusic/v${require("../package.json").version} (Bot: ${
        this.config.clientId
      })`,
      send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) {
          guild.shard.send(payload);
        }
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
      .on("nodeError", (node, err) => {
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}.`
        );
      })
      // on track error warn and create embed
      .on("trackError", (player, err) => {
        this.warn(
          `Player: ${player.options.guild} | Track had an error: ${err.message}.`
        );
        //console.log(err);
        let song = player.queue.current;
        var title = escapeMarkdown(song.title)
        var title = title.replace(/\]/g,"")
        var title = title.replace(/\[/g,"")
        
        let errorEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle("Playback error!")
          .setDescription(`Failed to load track: \`${title}\``)
          .setFooter({
            text: "Oops! something went wrong but it's not your fault!",
          });
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [errorEmbed] });
      })

      .on("trackStuck", (player, err) => {
        this.warn(`Track has an error: ${err.message}`);
        //console.log(err);
        let song = player.queue.current;
        var title = escapeMarkdown(song.title)
        var title = title.replace(/\]/g,"")
        var title = title.replace(/\[/g,"")
        
        let errorEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle("Track error!")
          .setDescription(`Failed to load track: \`${title}\``)
          .setFooter({
            text: "Oops! something went wrong but it's not your fault!",
          });
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [errorEmbed] });
      })
      .on("playerMove", (player, oldChannel, newChannel) => {
        const guild = client.guilds.cache.get(player.guild);
        if (!guild) {
          return;
        }
        const channel = guild.channels.cache.get(player.textChannel);
        if (oldChannel === newChannel) {
          return;
        }
        if (newChannel === null || !newChannel) {
          if (!player) {
            return;
          }
          if (channel) {
            channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(client.config.embedColor)
                  .setDescription(`Disconnected from <#${oldChannel}>`),
              ],
            });
          }
          return player.destroy();
        } else {
          player.voiceChannel = newChannel;
          setTimeout(() => player.pause(false), 1000);
          return undefined;
        }
      })
      .on("playerCreate", (player) => {
        player.set("twentyFourSeven", client.config.twentyFourSeven);
        player.set("autoQueue", client.config.autoQueue);
        player.set("autoPause", client.config.autoPause);
        player.set("autoLeave", client.config.autoLeave);
        this.warn(
          `Player: ${
            player.options.guild
          } | A wild player has been created in ${
            client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "a guild"
          }`
        );
      })
      .on("playerDestroy", (player) => {
        this.warn(
          `Player: ${player.options.guild} | A wild player has been destroyed in ${client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "a guild"
          }`
        )
        player.setNowplayingMessage(client, null);
      })
      // on LOAD_FAILED send error message
      .on("loadFailed", (node, type, error) =>
        this.warn(
          `Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`
        )
      )
      // on TRACK_START send message
      .on(
        "trackStart",
        /** @param {EpicPlayer} player */ async (player, track) => {
          this.songsPlayed++;
          playedTracks.push(track.identifier);
          if (playedTracks.length >= 100) {
            playedTracks.shift();
          }

          this.warn(
            `Player: ${
              player.options.guild
            } | Track has been started playing [${colors.blue(track.title)}]`
          );
            var title = escapeMarkdown(track.title)
            var title = title.replace(/\]/g,"")
            var title = title.replace(/\[/g,"")
          let trackStartedEmbed = this.Embed()
            .setAuthor({ name: "Now playing", iconURL: this.config.iconURL })
            .setDescription(
              `[${title}](${track.uri})` || "No Descriptions"
            )
            .addFields(
              {
                name: "Requested by",
                value: `${track.requester || `<@${client.user.id}>`}`,
                inline: true,
              },
              {
                name: "Duration",
                value: track.isStream
                  ? `\`LIVE\``
                  : `\`${prettyMilliseconds(track.duration, {
                      colonNotation: true,
                    })}\``,
                inline: true,
              }
            );
          try {
            trackStartedEmbed.setThumbnail(
              track.displayThumbnail("maxresdefault")
            );
          } catch (err) {
            trackStartedEmbed.setThumbnail(track.thumbnail);
          }
          let nowPlaying = await client.channels.cache
            .get(player.textChannel)
            .send({
              embeds: [trackStartedEmbed],
              components: [
                client.createController(player.options.guild, player),
              ],
            })
            .catch(this.warn);
          player.setNowplayingMessage(client, nowPlaying);
       }
      )
    
      .on(
        "playerDisconnect",
          /** @param {EpicPlayer} */ async (player) => {
            if (player.twentyFourSeven) {
              player.queue.clear();
              player.stop();
              player.set("autoQueue", false);
            } else {
              player.destroy();
            }
          }
      )
    
      .on(
        "queueEnd",
        /** @param {EpicPlayer} */ async (player, track) => {
          const autoQueue = player.get("autoQueue");

          if (autoQueue) {
            const requester = player.get("requester");
            const identifier = track.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, requester);
            let nextTrackIndex;

            res.tracks.some((track, index) => {
              nextTrackIndex = index;
              return !playedTracks.includes(track.identifier);
            });

            if (res.exception) {
              client.channels.cache.get(player.textChannel).send({
                embeds: [
                  new MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: `${res.exception.severity}`,
                      iconURL: client.config.iconURL,
                    })
                    .setDescription(
                      `Could not load track.\n**ERR:** ${res.exception.message}`
                    ),
                ],
              });
              return player.destroy();
            }

            player.play(res.tracks[nextTrackIndex]);
            player.queue.previous = track;
          } else {
            const twentyFourSeven = player.get("twentyFourSeven");

            let queueEmbed = new MessageEmbed()
              .setColor(client.config.embedColor)
              .setAuthor({
                name: "The queue has ended",
                iconURL: client.config.iconURL,
              })
              .setFooter({ text: "Queue ended" })
              .setTimestamp();
            let EndQueue = await client.channels.cache
              .get(player.textChannel)
              .send({ embeds: [queueEmbed] });
            setTimeout(() => EndQueue.delete(true), 5000);
            try {
              if (!player.playing && !twentyFourSeven) {
                setTimeout(async () => {
                  if (!player.playing && player.state !== "DISCONNECTED") {
                    let disconnectedEmbed = new MessageEmbed()
                      .setColor(client.config.embedColor)
                      .setAuthor({
                        name: "Disconnected!",
                        iconURL: client.config.iconURL,
                      })
                      .setDescription(
                        `The player has been disconnected due to inactivity.`
                      );
                    let Disconnected = await client.channels.cache
                      .get(player.textChannel)
                      .send({ embeds: [disconnectedEmbed] });
                    setTimeout(() => Disconnected.delete(true), 6000);
                    player.destroy();
                  } else if (player.playing) {
                    client.warn(
                      `Player: ${player.options.guild} | Still playing`
                    );
                  }
                }, client.config.disconnectTime);
              } else if (!player.playing && twentyFourSeven) {
                client.warn(
                  `Player: ${
                    player.options.guild
                  } | Queue has ended [${colors.blue("24/7 ENABLED")}]`
                );
              } else {
                client.warn(
                  `Something unexpected happened with player ${player.options.guild}`
                );
              }
              player.setNowplayingMessage(client, null);
            } catch (err) {
              client.error(err);
            }
          }
        }
      );
  }

  /**
   * Checks if a message has been deleted during the run time of the Bot
   * @param {Message} message
   * @returns
   */
  isMessageDeleted(message) {
    return this.deletedMessages.has(message);
  }

  /**
   * Marks (adds) a message on the client's `deletedMessages` WeakSet so it's
   * state can be seen through the code
   * @param {Message} message
   */
  markMessageAsDeleted(message) {
    this.deletedMessages.add(message);
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  Embed(text) {
    let embed = new MessageEmbed().setColor(this.config.embedColor);

    if (text) {
      embed.setDescription(text);
    }

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
      if (err) {
        throw err;
      } else {
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file);
          this.on(file.split(".")[0], event.bind(null, this));
          this.warn("Event Loaded: " + file.split(".")[0]);
        });
      }
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
      if (err) {
        throw err;
      } else {
        files.forEach((file) => {
          let cmd = require(SlashCommandsDirectory + "/" + file);

          if (!cmd || !cmd.run) {
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have an valid command with run function"
            );
          }
          this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("Slash Command Loaded: " + file.split(".")[0]);
        });
      }
    });

    let ContextCommandsDirectory = path.join(
      __dirname,
      "..",
      "commands",
      "context"
    );
    fs.readdir(ContextCommandsDirectory, (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach((file) => {
          let cmd = require(ContextCommandsDirectory + "/" + file);
          if (!cmd.command || !cmd.run) {
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have either command/run"
            );
          }
          this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("ContextMenu Loaded: " + file.split(".")[0]);
        });
      }
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

  createController(guild, player) {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("DANGER")
        .setCustomId(`controller:${guild}:Stop`)
        .setEmoji("⏹️"),

      new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId(`controller:${guild}:Replay`)
        .setEmoji("⏮️"),

      new MessageButton()
        .setStyle(player.playing ? "PRIMARY" : "DANGER")
        .setCustomId(`controller:${guild}:PlayAndPause`)
        .setEmoji(player.playing ? "⏸️" : "▶️"),

      new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId(`controller:${guild}:Next`)
        .setEmoji("⏭️"),

      new MessageButton()
        .setStyle(
          player.trackRepeat
            ? "SUCCESS"
            : player.queueRepeat
            ? "SUCCESS"
            : "DANGER"
        )
        .setCustomId(`controller:${guild}:Loop`)
        .setEmoji(player.trackRepeat ? "🔂" : player.queueRepeat ? "🔁" : "🔁")
    );
  }
}

module.exports = DiscordMusicBot;
