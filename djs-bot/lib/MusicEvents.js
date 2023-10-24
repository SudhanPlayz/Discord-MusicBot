"use strict";

const colors = require("colors");
const { getClient } = require("../bot");
const socket = require("../api/v1/dist/ws/eventsHandler");
const { updateControlMessage, updateNowPlaying } = require("../util/controlChannel");

// entries in this map should be removed when bot disconnected from vc
const progressUpdater = new Map();

function stopProgressUpdater(guildId) {
	const prevInterval = progressUpdater.get(guildId);

	if (prevInterval) {
		clearInterval(prevInterval);
		progressUpdater.delete(guildId);
	}
}

function updateProgress({ player, track }) {
	const gid = player.guild;
	if (!gid?.length) return;

	stopProgressUpdater(gid);

	progressUpdater.set(
		gid,
		setInterval(() => {
			if (!player.playing || player.paused) return;

			player.position += 1000;

			socket.handleProgressUpdate({
				guildId: player.guild,
				position: player.position,
			});
		}, 1000)
	);
}

function handleVoiceStateUpdate(oldState, newState) {
	// not leaving vc
	if (newState.channelId) return;

	// not client user
	if (newState.member.id !== newState.client.user.id) return;

	const gid = newState.guild.id;

	stopProgressUpdater(gid);
	socket.handleStop({ guildId: gid });
}

function handleStop({ player }) {
	socket.handleStop({ guildId: player.guild });
}

function handleQueueUpdate({ guildId, player }) {
	socket.handleQueueUpdate({ guildId, player });
}

/**
 * @param {import("./MusicEvents").IHandleTrackStartParams}
 */
function handleTrackStart({ player, track }) {
	const client = getClient();

	const playedTracks = client.playedTracks;

	if (playedTracks.length >= 25) playedTracks.shift();

	if (!playedTracks.includes(track)) playedTracks.push(track);

	updateNowPlaying(player, track);
	updateControlMessage(player.guild, track);

	socket.handleTrackStart({ player, track });
	handleQueueUpdate({ guildId: player.guild, player });

	updateProgress({ player, track });

	client.warn(
		`Player: ${player.guild} | Track has started playing [${colors.blue(track.title)}]`
	);
}

module.exports = {
	handleTrackStart,
	handleQueueUpdate,
	handleStop,
	updateProgress,
	stopProgressUpdater,
	handleVoiceStateUpdate,
};
