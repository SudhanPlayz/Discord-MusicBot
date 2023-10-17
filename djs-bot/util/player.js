const { GuildMember } = require("discord.js");
const { handleQueueUpdate } = require("../lib/MusicEvents");

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
		player.queue.splice(0, 0, currentSong);
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

	handleQueueUpdate({
		guildId: player.guildId,
		player,
	});

	return ret;
};

module.exports = {
	playPrevious,
	stop,
	skip,
	joinStageChannelRoutine,
	addTrack,
};
