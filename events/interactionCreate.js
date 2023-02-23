const Controller = require("../util/Controller");
const yt = require("youtube-sr").default;

/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */
module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        let command = client.slashCommands.find(
            (x) => x.name == interaction.commandName,
        );
        if (!command || !command.run) {
            return interaction.reply(
                "Sorry the command you used doesn't have any run function",
            );
        }
        client.commandsRan++;
        command.run(client, interaction, interaction.options);
        return;
    }

    if (interaction.isContextMenu()) {
        let command = client.contextCommands.find(
            (x) => x.command.name == interaction.commandName,
        );
        if (!command || !command.run) {
            return interaction.reply(
                "Sorry the command you used doesn't have any run function",
            );
        }
        client.commandsRan++;
        command.run(client, interaction, interaction.options);
        return;
    }

    if (interaction.isButton()) {
        if (interaction.customId.startsWith("controller")) {
            Controller(client, interaction);
        }
    }

    if (interaction.isAutocomplete()) {
        const url = interaction.options.getString("query")
        if (url === "") return;

        const match = [
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
            /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
            /^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
            /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
            /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/
        ].some(function (match) {
            return match.test(url) == true;
        });

        async function checkRegex() {
            if (match == true) {
                let choice = []
                choice.push({ name: url, value: url })
                await interaction.respond(choice).catch(() => { });
            }
        }

        const Random = "ytsearch"[Math.floor(Math.random() * "ytsearch".length)];

        if (interaction.commandName == "play") {
            checkRegex()
            let choice = []
            await yt.search(url || Random, { safeSearch: false, limit: 25 }).then(result => {
                result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
            });
            return await interaction.respond(choice).catch(() => { });
        } else if (result.loadType === "LOAD_FAILED" || "NO_MATCHES")
            return;
    }
};
