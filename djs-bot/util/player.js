const { GuildMember } = require("discord.js");
const { handleQueueUpdate, handleStop, handlePause } = require("../lib/MusicEvents");

const triggerSocketQueueUpdate = (player) => {
	handleQueueUpdate({
		guildId: player.guild,
		player,
	});
};

const triggerSocketPause = (player, state) => {
	handlePause({
		player,
		state,
	});
};

const spliceQueue = (player, ...restArgs) => {
	const ret = player.queue.splice(...restArgs);

	triggerSocketQueueUpdate(player);

	return ret;
};

const clearQueue = (player) => {
	const ret = player.queue.clear();

	triggerSocketQueueUpdate(player);

	return ret;
};

const removeTrack = (player, ...restArgs) => {
	const ret = player.queue.remove(...restArgs);

	triggerSocketQueueUpdate(player);

	return ret;
};

const shuffleQueue = (player) => {
	const ret = player.queue.shuffle();

	triggerSocketQueueUpdate(player);

	return ret;
};

/**
 * @param {import("cosmicord.js").CosmiPlayer} player
 */
const playPrevious = async (player) => {
	const previousSong = player.queue.previous;
	const currentSong = player.queue.current;
	const nextSong = player.queue[0];

	if (!previousSong || previousSong === currentSong || previousSong === nextSong) {
		return 1;
	}

	if (previousSong !== currentSong && previousSong !== nextSong) {
		spliceQueue(player, 0, 0, currentSong);
		await player.play(previousSong);
	}

	return 0;
};

/**
 * @param {import("cosmicord.js").CosmiPlayer} player
 */
const stop = (player) => {
	if (player.twentyFourSeven) {
		player.queue.clear();
		player.stop();
		player.set("autoQueue", false);
	} else {
		player.destroy();
	}

	// !TODO: test if need to empty queue manually here,
	// does destroy also clears queue?

	handleStop({ player });
	triggerSocketQueueUpdate(player);

	return 0;
};

/**
 * @param {import("cosmicord.js").CosmiPlayer} player
 */
const skip = (player) => {
	const autoQueue = player.get("autoQueue");
	if (player.queue[0] == undefined && (!autoQueue || autoQueue === false)) {
		return 1;
	}

	player.queue.previous = player.queue.current;
	player.stop();

	handleStop({ player });

	return 0;
};

const joinStageChannelRoutine = (me) => {
	if (!(me instanceof GuildMember)) throw new TypeError("me is not GuildMember");

	setTimeout(() => {
		if (me.voice.suppress == true) {
			try {
				me.voice.setSuppressed(false);
			} catch (e) {
				me.voice.setRequestToSpeak(true);
			}
		}
	}, 2000); // Need this because discord api is buggy asf, and without this the bot will not request to speak on a stage - Darren
};

/**
 * @type {(player: import("../lib/clients/MusicClient").CosmicordPlayerExtended, track: import("cosmicord.js").CosmiTrack|import("cosmicord.js").CosmiTrack[]):any}
 */
const addTrack = (player, tracks) => {
	const ret = player.queue.add(tracks);

	triggerSocketQueueUpdate(player);

	return ret;
};

const pause = (player, state) => {
	const ret = player.pause(state);

	triggerSocketPause(player, state);

	return ret;
};

module.exports = {
	playPrevious,
	stop,
	skip,
	joinStageChannelRoutine,
	addTrack,
	spliceQueue,
	triggerSocketQueueUpdate,
	clearQueue,
	removeTrack,
	shuffleQueue,
	triggerSocketPause,
	pause,
};
