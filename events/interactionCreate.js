const Controller = require("../util/Controller");

/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */
module.exports = async(client, interaction) => {

if (interaction.isAutocomplete()) {
	switch (interaction.commandName) {
	case 'play':	
	  /**
           * @type {import("discord.js").AutocompleteFocusedOption}
           */
          const focused = interaction.options.getFocused(true);

          if (focused.name === "query") {
            if (focused.value === "") return;
            /**
             * @type {SearchResult}
             */
            const result = await client.manager.search(
              focused.value,
              interaction.user
            );

            if (result.loadType === "TRACK_LOADED" || "SEARCH_RESULT") {
              /**
               * @type {Track[]}
               */
              const sliced = result.tracks.slice(0, 5).sort();

              if (
                focused.value.match(
                  /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|episode|show|album)[\/:]([A-Za-z0-9]+)/ ||
                    /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|album|playlist)\/(\d+)/ ||
                    /^((?:https?:)\/\/)?((?:deezer)\.)?((?:page.link))\/([a-zA-Z0-9]+)/ ||
                    /(?:https:\/\/music\.apple\.com\/)(?:\w{2}\/)?(track|album|playlist)/g ||
                    /(http(s|):\/\/music\.apple\.com\/..\/.....\/.*\/([0-9]){1,})\?i=([0-9]){1,}/gim ||
                    /(?:https?:\/\/)?(?:www.|web.|m.)?(facebook|fb).(com|watch)\/(?:video.php\?v=\d+|(\S+)|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?/g
                )
              ) {
                  await interaction.respond(
                    sliced.map((track) => ({
                      name: track.title,
                      value: focused.value,
                    }))
                  );
                  return;
              } else {
                await interaction.respond(
                  sliced.map((track) => ({
                    name: track.title,
                    value: track.uri,
                  }))
                );
              }
            } else if (result.loadType === "LOAD_FAILED" || "NO_MATCHES")
              return;
          }
      }				
  }
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
};
