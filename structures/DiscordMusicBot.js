const { Collection, Client, MessageEmbed } = require("discord.js");
const { LavasfyClient } = require("lavasfy");
const { Manager } = require("erela.js");
const { Server } = require("socket.io");
const http = require("http");
const Jsoning = require("jsoning");
const fs = require("fs");
const path = require("path");
const Express = require("express");
const Logger = require("./Logger");
const prettyMilliseconds = require("pretty-ms");
const deezer = require("erela.js-deezer");
const apple = require("erela.js-apple");
const facebook = require("erela.js-facebook");
let d;

//Class extending Stuff
require("discordjs-activity"); //Epic Package, For more details: https://www.npmjs.com/package/discordjs-activity
require("./EpicPlayer"); //idk why im doing but i wanna learn something new so...

class DiscordMusicBot extends Client {
  constructor(props) {
    super(props);

    this.commands = new Collection();
    this.connections = new Map();
    this.CommandsRan = 0;
    this.SongsPlayed = 0;

    this.database = {
      //Saved at jsoning node_modules directory, DOCS: https://jsoning.js.org/
      guild: new Jsoning("guild.json"), //Server Config
    };
    this.logger = new Logger(path.join(__dirname, "..", "Logs.log"));

    try {
      //Config for testing
      this.botconfig = require("../dev-config");
    } catch {
      //Config for production
      this.botconfig = require("../botconfig");
    }
    if (this.botconfig.Token === "")
      return new TypeError(
        "The botconfig.js is not filled out. Please make sure nothing is blank, otherwise the bot will not work properly."
      );

    this.LoadCommands();
    this.LoadEvents();

    //Web Stuff
    this.server = Express();
    this.http = http.createServer(this.server);
    this.server.use("/", require("../api"));
    this.io = new Server(this.http);
    require("../api/socket")(this.io);

    //Utils
    this.ProgressBar = require("../util/ProgressBar");
    this.Pagination = require("../util/pagination");
    this.ParseHumanTime = (str) => {
      let Parsed;
      try {
        Parsed = require("../util/TimeString")(str);
        return Parsed;
      } catch {
        Parsed = false;
        return Parsed;
      }
    };

    this.Ready = false;

    //idk where do i do it so i did it here ;-;
    this.ws.on("INTERACTION_CREATE", async (interaction) => {
      let GuildDB = await this.GetGuild(interaction.guild_id);

      //Initialize GuildDB
      if (!GuildDB) {
        await this.database.guild.set(interaction.guild_id, {
          prefix: this.botconfig.DefaultPrefix,
          DJ: null,
        });
        GuildDB = await this.GetGuild(interaction.guild_id);
      }

      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;

      //Easy to send respnose so ;)
      interaction.guild = await this.guilds.fetch(interaction.guild_id);
      interaction.send = async (message) => {
        return await this.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data:
                typeof message == "string"
                  ? { content: message }
                  : message.type && message.type === "rich"
                  ? { embeds: [message] }
                  : message,
            },
          });
      };

      let cmd = client.commands.get(command);
      if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(this, interaction, args, { GuildDB });
    });

    //because not worked lol ;-;
    const client = this;

    this.Lavasfy = new LavasfyClient(
      {
        clientID: this.botconfig.Spotify.ClientID,
        clientSecret: this.botconfig.Spotify.ClientSecret,
        playlistPageLoadLimit: 1,
        filterAudioOnlyResult: true,
        autoResolve: true,
        useSpotifyMetadata: true,
      },
      [
        {
          id: this.botconfig.Lavalink.id,
          host: this.botconfig.Lavalink.host,
          port: this.botconfig.Lavalink.port,
          password: this.botconfig.Lavalink.pass,
          secure: this.botconfig.Lavalink.secure,
        },
      ]
    );

    this.Manager = new Manager({
      plugins: [new deezer(), new apple(), new facebook()],
      nodes: [
        {
          identifier: this.botconfig.Lavalink.id,
          host: this.botconfig.Lavalink.host,
          port: this.botconfig.Lavalink.port,
          password: this.botconfig.Lavalink.pass,
          secure: this.botconfig.Lavalink.secure,
          retryAmount: this.botconfig.Lavalink.retryAmount,
          retryDelay: this.botconfig.Lavalink.retryDelay,
        },
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        this.log(`Lavalink: Node ${node.options.identifier} connected`)
      )
      .on("nodeError", (node, error) =>
        this.log(
          `Lavalink: Node ${node.options.identifier} had an error: ${error.message}`
        )
      )
      .on("trackStart", async (player, track) => {
        this.SongsPlayed++;
        let TrackStartedEmbed = new MessageEmbed()
          .setAuthor(`Now playing ♪`, this.botconfig.IconURL)
          .setThumbnail(player.queue.current.displayThumbnail())
          .setDescription(`[${track.title}](${track.uri})`)
          .addField("Requested by", `${track.requester}`, true)
          .setColor(this.botconfig.EmbedColor);

        // Check if the duration matches the duration of a livestream
        if (track.duration == 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(track.duration, { colonNotation: true });
        }

        TrackStartedEmbed.addField("Duration", `\`${d}\``, true);

        //.setFooter("Started playing at");
        let NowPlaying = await client.channels.cache
          .get(player.textChannel)
          .send(TrackStartedEmbed);
        player.setNowplayingMessage(NowPlaying);
      })
      .on("queueEnd", (player) => {
        let QueueEmbed = new MessageEmbed()
          .setAuthor("The queue has ended", this.botconfig.IconURL)
          .setColor(this.botconfig.EmbedColor)
          .setTimestamp();
        client.channels.cache.get(player.textChannel).send(QueueEmbed);
        if (!this.botconfig["24/7"]) player.destroy();
      });
  }

  LoadCommands() {
    let CommandsDir = path.join(__dirname, "..", "commands");
    fs.readdir(CommandsDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          let cmd = require(CommandsDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run)
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't had run/name/desciption"
            );
          this.commands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("Command Loaded: " + file.split(".")[0]);
        });
    });
  }

  LoadEvents() {
    let EventsDir = path.join(__dirname, "..", "events");
    fs.readdir(EventsDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file);
          this.on(file.split(".")[0], event.bind(null, this));
          this.logger.log("Event Loaded: " + file.split(".")[0]);
        });
    });
  }

  async GetGuild(GuildID) {
    return new Promise(async (res, rej) => {
      let guild = await this.database.guild
        .get(GuildID)
        .catch((err) => rej(err));
      res(guild);
    });
  }

  log(Text) {
    this.logger.log(Text);
  }

  sendError(Channel, Error) {
    let embed = new MessageEmbed()
      .setTitle("An error occured")
      .setColor("RED")
      .setDescription(Error)
      .setFooter(
        "If you think this as a bug, please report it in the support server!"
      );

    Channel.send(embed);
  }

  sendTime(Channel, Error) {
    let embed = new MessageEmbed()
      .setColor(this.botconfig.EmbedColor)
      .setDescription(Error);

    Channel.send(embed);
  }

  build() {
    this.login(this.botconfig.Token);
    if (this.botconfig.ExpressServer) {
      this.http.listen(process.env.PORT || this.botconfig.Port, () =>
        this.log("Web Server has been started")
      );
    }
  }

  RegisterSlashCommands() {
    this.guilds.cache.forEach((guild) => {
      require("../util/RegisterSlashCommands")(this, guild.id);
    });
  }
}

module.exports = DiscordMusicBot;
