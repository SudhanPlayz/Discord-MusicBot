"use strict";

const colors = require("colors");
import { getClient } from "../bot";
import * as socket from "../api/v1/dist/ws/eventsHandler";
const { updateControlMessage, updateNowPlaying } = require("../../util/controlChannel");

export function handleTrackStart({ player, track }) {
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
