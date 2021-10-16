const { Client, MessageEmbed } = require('discord.js');
const path = require("path")
const prettyMilliseconds = require("pretty-ms");
const { Manager } = require('erela.js');
const ConfigFetcher = require("../util/getConfig")
const Logger = require("./Logger")
const spotify = require('better-erela.js-spotify').default;
const apple = require('erela.js-apple');
const deezer = require('erela.js-deezer');
const facebook = require('erela.js-facebook');

class DiscordMusicBot extends Client{
    /**
     * Create the music client
     * @param {import("discord.js").ClientOptions} props - Client options
     */
    constructor(props = {
        intents: [
            //insert intents here
        ]
    })
    
    {
        super(props)

        this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

        ConfigFetcher().then(conf => {
            this.config = conf
            this.build()
        }).catch(err => {
            throw Error(err)
        })
    }
    
    /**
     * Send an info message
     * @param {string} text 
     */
    log(text){
        this.logger.log(text)
    }

    /**
     * Send an warning message
     * @param {string} text 
     */
    warn(text){
        this.logger.warn(text)
    }

    /**
     * Build em
     */
    build(){
        this.log("Started the bot...")
        this.login(this.config.token);

        let client = this;

        this.manager = new Manager({
            plugins: [
                new deezer(),
                new apple(),
                new spotify(),
                new facebook(),
            ],
            nodes: this.config.nodes,
            send: (id, payload) => {
                let guild = client.guilds.cache.get(id)
                if(guild) guild.shard.send(payload)
            },
        })
        .on("nodeConnect", (node) =>
            this.log(`Node: ${node.options.identifier} | Lavalink node is connected.`)
        ).on("nodeReconnect", (node) => 
            this.warn(`Node: ${node.options.identifier} | Lavalink node is reconnecting.`)
        ).on("nodeDestroy", (node) => 
            this.warn(`Node: ${node.options.identifier} | Lavalink node is destroyed.`)
        ).on("nodeDisconnect", (node) => 
            this.warn(`Node: ${node.options.identifier} | Lavalink node is disconnected.`)
        ).on("nodeError", (node, err) => 
            this.warn(`Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}`)
        ).on("trackError", (player, track) => 
            this.warn(`Player: ${player.options.guild} | Track had an error.`)
        ).on("trackStuck", (player, track, threshold) => 
            this.warn(`Player: ${player.options.guild} | Track is stuck.`) 
        ).on("playerCreate", (player) =>
            this.warn(`Player: ${player.options.guild} | A wild player has been created in ${client.guilds.cache.get(player.options.guild)?client.guilds.cache.get(player.options.guild).name:"a guild"}`)
        ).on("playerDestroy", (player) =>
            this.warn(`Player: ${player.options.guild} | A wild player has been destroyed in ${client.guilds.cache.get(player.options.guild)?client.guilds.cache.get(player.options.guild).name:"a guild"}`)
        ).on("trackStart", async (player, track) => {
            let TrackStartedEmbed = this.Embed()
              .setAuthor(`Now playing ♪`, this.config.IconURL)
              .setThumbnail(player.queue.current.displayThumbnail())
              .setDescription(`[${track.title}](${track.uri})`)
              .addField("Requested by", `${track.requester}`, true)
              .addField(
                "Duration",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              )
              .setTimestamp()
              .setFooter("Started playing at");

            let NowPlaying = await client.channels.cache
              .get(player.textChannel)
              .send(TrackStartedEmbed);
            player.setNowplayingMessage(NowPlaying);
          })
          .on("queueEnd", (player) => {
            let QueueEmbed = this.Embed()
              .setAuthor("The queue has ended", this.config.iconURL)
              .setTimestamp();
            client.channels.cache.get(player.textChannel).send(QueueEmbed);
          });
    }

    Embed(){
        let embed = new MessageEmbed()
        .setColor(this.config.embedColor)

        return embed
    }
}

module.exports = DiscordMusicBot;