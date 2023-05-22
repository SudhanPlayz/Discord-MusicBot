// 4153 constant events
// (node_modules\discord.js\typings\rawDataTypes.d.ts)

const { RawActivityData } = require("discord.js");
const Bot = require("../../lib/Bot");

// raw data, meaning it can be any of the emitted events from the API
// functions as a general handler for any event

/* It processes data of this structure
data structure: {
	t: the event name for this payload (type)
	s: sequence number, used for resuming sessions and heartbeats (number of the event)
	op: opcode for the payload ()
	d: event data
}

OPCODES:
0	Dispatch				Receive			An event was dispatched.
1	Heartbeat				Send/Receive	Fired periodically by the client to keep the connection alive.
2	Identify				Send			Starts a new session during the initial handshake.
3	Presence Update			Send			Update the client's presence.
4	Voice State Update		Send			Used to join/leave or move between voice channels.
6	Resume					Send			Resume a previous session that was disconnected.
7	Reconnect				Receive			You should attempt to reconnect and resume immediately.
8	Request Guild Members	Send			Request information about offline guild members in a large guild.
9	Invalid Session			Receive			The session has been invalidated. You should reconnect and identify/resume accordingly.
10	Hello					Receive			Sent immediately after connecting, contains the heartbeat_interval to use.
11	Heartbeat ACK			Receive			Sent in response to receiving a heartbeat to acknowledge that it has been received.

Heartbeat regex: ^\{[^}]*\}","[^"]*":"\[[^\]]*\]"\}$
*/
const exceptions = [11, 1];

/**
 * 
 * @param {Bot} client 
 * @param {RawActivityData} data 
 */
module.exports = (client, data) => {
	if ((client.OPLevel >= 2) && !exceptions.includes(parseInt(data.op)))
	client.debug("> rawData", JSON.stringify(data, null, 4))
};
