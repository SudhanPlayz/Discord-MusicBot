const { Message } = require("discord.js");
const { getClient } = require("../bot");
const {
	controlChannelMessage,
	colorEmbed,
	redEmbed,
	addQueueEmbed,
	loadedPlaylistEmbed,
	trackStartedEmbed,
} = require("./embeds");
const { joinStageChannelRoutine } = require("./player");

/**
 * @type {Map<string, Message>}
 */
const controlChannelMessageCache = new Map();

const setControlChannelMessage = (guildId, message) => {
	return controlChannelMessageCache.set(guildId, message);
};

/**
 * @param {string} guildId
 * @returns {Promise<Message | null>}
 */
const getControlChannelMessage = async (guildId) => {
	if (!guildId) throw new Error("No guild Id provided");

	const cache = controlChannelMessageCache.get(guildId);
	if (cache !== undefined) return cache;

	const client = getClient();

	if (!client.db) throw new Error("No database configured");

	const { controlChannelId, controlChannelMessageId } =
		(await client.db.guild.findFirst({
			where: {
				guildId,
			},
		})) || {};

	if (!controlChannelId || !controlChannelMessageId) {
		setControlChannelMessage(guildId, null);
		return null;
	}

	const message = new Message(client, {
		id: controlChannelMessageId,
		channel_id: controlChannelId,
	});

	setControlChannelMessage(guildId, message);

	return message;
};

const deleteControlChannelMessage = (guildId) => {
	return controlChannelMessageCache.delete(guildId);
};

const setDbControlChannel = async ({ guildId, channelId, messageId } = {}) => {
	if (!guildId) throw new Error("No guildId provided");

	const client = getClient();

	if (channelId?.length && messageId?.length)
		setControlChannelMessage(
			guildId,
			new Message(client, {
				id: messageId,
				channel_id: channelId,
			})
		);
	else deleteControlChannelMessage(guildId);

	if (!client.db) throw new Error("No db configured");

	await client.db.guild.upsert({
		where: {
			guildId,
		},
		create: {
			controlChannelId: channelId,
			guildId,
			controlChannelMessageId: messageId,
		},
		update: {
			controlChannelId: channelId,
			controlChannelMessageId: messageId,
		},
	});
};

// handle control message delete
// the only way to recreate message is running `/config control-channel`
// command again
const handleMessageDelete = async (message) => {
	const guildId = message.guildId;

	const savedMessage = await getControlChannelMessage(guildId);

	if (
		!savedMessage ||
		savedMessage.id !== message.id ||
		savedMessage.channelId !== message.channelId
	)
		return;

	deleteControlChannelMessage(guildId);

	const client = getClient();

	if (!client.db) throw new Error("No database configured");

	await client.db.guild.update({
		where: {
			controlChannelId: message.channelId,
			controlChannelMessageId: message.id,
			guildId,
		},
		data: {
			controlChannelMessageId: null,
		},
	});
};

const updateControlMessage = async (guildId, track) => {
	const message = await getControlChannelMessage(guildId);

	if (!message) throw new Error("Guild doesn't have control channel");

	return message.edit(controlChannelMessage({ guildId, track }));
};

/**
 * @param {import("discord.js").Message} message
 */
const handleMessageCreate = async (message) => {
	if (!message?.guildId || message.author.bot) return;

	const controlChannelMessage = await getControlChannelMessage(message.guildId);

	if (!controlChannelMessage || controlChannelMessage.channelId !== message.channelId) return;

	const retDel = async () => {
		return message.delete().catch(client.warn);
	};

	const client = getClient();

	const memberVC = message.member?.voice?.channel;
	if (!memberVC?.joinable) return retDel();

	const clientVC = message.guild.members.cache.get(client.user.id)?.voice?.channel;
	const isNotInSameVC = !clientVC?.equals(memberVC);

	if (clientVC && isNotInSameVC) return retDel();

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
		setTimeout(async () => await responseMessage.delete(), 20000);

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
		player.queue.add(firstTrack);

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
		player.queue.add(searchResult.tracks);

		triggerPlay();

		await editResponse({
			embeds: [loadedPlaylistEmbed({ searchResult, query })],
		});
	}

	return retDelAll();
};

const runIfNotControlChannel = async (player, cb) => {
	const controlMessage = await getControlChannelMessage(player.guild);

	if (player.textChannel !== controlMessage?.channelId) {
		return cb();
	}
};

/**
 * @param {import("../lib/clients/MusicClient").CosmicordPlayerExtended} player
 * @param {import("cosmicord.js").CosmiTrack} track
 */
const updateNowPlaying = async (player, track) => {
	return runIfNotControlChannel(player, async () => {
		const client = getClient();
		const nowPlaying = await client.channels.cache
			.get(player.textChannel)
			.send({ embeds: [trackStartedEmbed({ track })] })
			.catch(client.warn);

		player.setNowplayingMessage(client, nowPlaying);
	});
};

module.exports = {
	handleMessageDelete,
	setControlChannelMessage,
	getControlChannelMessage,
	deleteControlChannelMessage,
	updateControlMessage,
	setDbControlChannel,
	handleMessageCreate,
	updateNowPlaying,
	runIfNotControlChannel,
};
