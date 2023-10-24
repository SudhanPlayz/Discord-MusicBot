const musicEvents = require("../../lib/MusicEvents");

module.exports = (client, oldState, newState) => {
	musicEvents.handleVoiceStateUpdate(oldState, newState);
};
