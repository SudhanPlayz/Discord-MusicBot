/**
 * @param {import("cosmicord.js").CosmiPlayer} player
 */
const playPrevious = (player) => {
	/**
	 * @param {number} status
	 * @param {import("cosmicord.js").CosmiTrack | undefined} previousSong
	 */
	const ret = (status, previousSong) => ({ status, previousSong });

	const previousSong = player.queue.previous;
	const currentSong = player.queue.current;
	const nextSong = player.queue[0];

	if (!previousSong || previousSong === currentSong || previousSong === nextSong) {
		return ret(1, previousSong);
	}

	if (previousSong !== currentSong && previousSong !== nextSong) {
		player.queue.splice(0, 0, currentSong);
		player.play(previousSong);
	}

	return ret(0, previousSong);
};

module.exports = {
	playPrevious,
};
