"use strict";

const colors = require("colors");
const { getClient } = require("../bot");
const socket = require("../api/v1/dist/ws/eventsHandler");
const { updateControlMessage, updateNowPlaying } = require("../util/controlChannel");

function handleTrackStart({ player, track }) {
	const client = getClient();

	const playedTracks = client.playedTracks;

	if (playedTracks.length >= 25) playedTracks.shift();

	if (!playedTracks.includes(track)) playedTracks.push(track);

	updateNowPlaying(player, track);
	updateControlMessage(player.guild, track);

	socket.handleTrackStart({ player, track });

	client.warn(
		`Player: ${player.guildId} | Track has started playing [${colors.blue(
			track.title
		)}]`
	);
}

function handleQueueUpdate({ guildId, player }) {
	socket.handleQueueUpdate({ guildId, player });
}

module.exports = {
	handleTrackStart,
	handleQueueUpdate,
};
