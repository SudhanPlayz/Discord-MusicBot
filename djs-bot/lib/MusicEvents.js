"use strict";

const colors = require("colors");
const { getClient } = require("../bot");
const socket = require("../api/v1/dist/ws/eventsHandler");
const { updateControlMessage, updateNowPlaying } = require("../util/controlChannel");

function handleStop({ player }) {
	socket.handleStop({ guildId: player.guild });
}

function handleQueueUpdate({ guildId, player }) {
	socket.handleQueueUpdate({ guildId, player });
}

function handleTrackStart({ player, track }) {
	const client = getClient();

	const playedTracks = client.playedTracks;

	if (playedTracks.length >= 25) playedTracks.shift();

	if (!playedTracks.includes(track)) playedTracks.push(track);

	updateNowPlaying(player, track);
	updateControlMessage(player.guild, track);

	socket.handleTrackStart({ player, track });
	handleQueueUpdate({ guildId: player.guild, player });

	client.warn(
		`Player: ${player.guild} | Track has started playing [${colors.blue(track.title)}]`
	);
}

module.exports = {
	handleTrackStart,
	handleQueueUpdate,
	handleStop,
};
