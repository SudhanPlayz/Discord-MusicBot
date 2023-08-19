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

module.exports = {
	playPrevious,
	stop,
	skip,
};
