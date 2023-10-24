const { getClient } = require("../bot");
const { getControlChannelMessage } = require("./controlChannel");
const { redEmbed, colorEmbed, addQueueEmbed, loadedPlaylistEmbed } = require("./embeds");
const { joinStageChannelRoutine, addTrack } = require("./player");

/**
 * @param {import("discord.js").Message} message
 */
const handleMessageCreate = async (message) => {
	const client = getClient();

	if (!message?.guildId || message.author.id === client.user.id) return;

	const controlChannelMessage = await getControlChannelMessage(message.guildId);

	if (!controlChannelMessage || controlChannelMessage.channelId !== message.channelId) return;

	const retDel = async () => {
		return message.delete().catch(client.warn);
	};

	if (message.webhookId || (message.author.bot && message.author.id !== client.user.id))
		return retDel();

	const returnError = async (desc) => {
		// message reply can't be ephemeral
		const msg = await message.reply({
			embeds: [
				redEmbed({
					desc,
				}),
			],
			target: message,
		});

		setTimeout(async () => await msg.delete().catch(client.warn), 20000);

		return retDel();
	};

	const memberVC = message.member?.voice?.channel;
	if (!memberVC) return returnError("You're not in a voice channel!");

	const clientVC = message.guild.members.cache.get(client.user.id)?.voice?.channel;
	const isNotInSameVC = !clientVC?.equals(memberVC);

	if (clientVC && isNotInSameVC) return returnError("You're not in my voice channel!");

	if (!memberVC.joinable)
		return returnError("I don't have enough permission to join your voice channel");

	const node = await client.getLavalink(client);
	if (!node) return retDel();

	const query = message.content.trim();
	if (!query.length) return retDel();

	const player = client.manager.Engine.createPlayer({
		guildId: message.guild.id,
		voiceChannel: memberVC.id,
		textChannel: message.channel.id,
	});

	if (player.state !== "CONNECTED") {
		player.connect();
	}

	if (memberVC.type == "GUILD_STAGE_VOICE") {
		joinStageChannelRoutine(message.guild.members.me);
	}

	const responseMessage = await message
		.reply({
			embeds: [colorEmbed({ desc: ":mag_right: **Searching...**" })],
			fetchReply: true,
		})
		.catch(client.warn);

	if (!responseMessage) return retDel();

	const editResponse = async (payload) => responseMessage.edit(payload).catch(client.warn);

	const retDelAll = async () => {
		setTimeout(async () => await responseMessage.delete().catch(client.warn), 20000);

		return retDel();
	};

	const searchResult = await player.search(query, message.author).catch((err) => {
		client.error(err);
		return {
			loadType: "LOAD_FAILED",
		};
	});

	const playerDestroy = () => {
		if (!player.queue.current) {
			player.destroy();
		}
	};

	const triggerPlay = () => {
		if (!player.playing && !player.paused) {
			player.play();
		}
	};

	const loadFailed = searchResult.loadType === "LOAD_FAILED";
	const noMatches = searchResult.loadType === "NO_MATCHES";
	const trackLoaded =
		searchResult.loadType === "TRACK_LOADED" ||
		searchResult.loadType === "SEARCH_RESULT";

	const playlistLoaded = searchResult.loadType === "PLAYLIST_LOADED";

	if (loadFailed || noMatches) {
		playerDestroy();

		await editResponse({
			embeds: [
				redEmbed({
					desc: noMatches
						? "No results were found"
						: "There was an error while searching",
				}),
			],
		});

		return retDelAll();
	}

	const firstTrack = searchResult.tracks[0];

	if (trackLoaded) {
		addTrack(player, firstTrack);

		triggerPlay();

		if (player.queue.totalSize <= 1) player.queue.previous = player.queue.current;

		await editResponse({
			embeds: [
				addQueueEmbed({
					track: firstTrack,
					player,
					requesterId: message.author.id,
				}),
			],
		});
	}

	if (playlistLoaded) {
		addTrack(player, searchResult.tracks);

		triggerPlay();

		await editResponse({
			embeds: [loadedPlaylistEmbed({ searchResult, query })],
		});
	}

	return retDelAll();
};

module.exports = {
	handleMessageCreate,
};
