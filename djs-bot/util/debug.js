"use strict";
const getConfig = require("./getConfig")

/*

https://discord-ts.js.org/docs/general/events/

UNUSED EVENTS
[
	'applicationCommandCreate',
	'applicationCommandDelete',
	'applicationCommandUpdate',
	'guildCreate',
	'guildDelete',
	'guildUpdate',
	'guildUnavailable',
	'guildMemberAdd',
	'guildMemberRemove',
	'guildMemberUpdate',
	'guildMemberAvailable',
	'guildMembersChunk',
	'guildIntegrationsUpdate',
	'roleCreate',
	'roleDelete',
	'inviteCreate',
	'inviteDelete',
	'roleUpdate',
	'guildBanAdd',
	'guildBanRemove',
	'channelCreate',
	'channelDelete',
	'channelUpdate',
	'channelPinsUpdate',
	'messageCreate',
	'messageDelete',
	'messageUpdate',
	'messageDeleteBulk',
	'messageReactionAdd',
	'messageReactionRemove',
	'messageReactionRemoveAll',
	'messageReactionRemoveEmoji',
	'threadCreate',
	'threadDelete',
	'threadUpdate',
	'threadListSync',
	'threadMemberUpdate',
	'threadMembersUpdate',
	'userUpdate',
	'guildScheduledEventCreate',
	'guildScheduledEventUpdate',
	'guildScheduledEventDelete',
	'guildScheduledEventUserAdd',
	'guildScheduledEventUserRemove',
	'stageInstanceCreate',
	'stageInstanceUpdate',
	'stageInstanceDelete',
	'presenceUpdate',
	'emojiCreate',
	'emojiDelete',
	'emojiUpdate',
	'interactionCreate',
	'typingStart',
	'stickerCreate',
	'stickerDelete',
	'stickerUpdate',
]
*/

/* 
https://discord.js.org/#/docs/main/stable/class/GuildAuditLogs
https://discord.js.org/#/docs/main/stable/typedef/AuditLogAction
https://discord.js.org/#/docs/main/stable/class/Guild?scrollTo=fetchAuditLogs 

await guild.fetchAuditLogs().then(audit => client.warn(JSON.stringify(audit.entries.first())))
*/

/* 
{
	'0-999': '(Unused)',
	'1016-1999': '(For WebSocket standard)',
	'2000-2999': '(For WebSocket extensions)',
	'3000-3999': '(For libraries and frameworks)',
	'4000-4999': '(For applications)'
}
[
	'1000' : {
		'reason': 'CLOSE_NORMAL', 
		'description': 'normal socket shut down'
	},
	'1001' : {
		'reason': 'CLOSE_GOING_AWAY', 
		'description': 'browser tab closing'
	},
	'1002' : {
		'reason': 'CLOSE_PROTOCOL_ERROR', 
		'description': 'endpoint received a malformed frame'
	},
	'1003' : {
		'reason': 'CLOSE_UNSUPPORTED', 
		'description': 'endpoint received unsupported frame'
	},
	'1004' : {
		'reason': 'NO_CODE_NAME', 
		'description': 'reserved'
	},
	'1005' : {
		'reason': 'CLOSED_NO_STATUS', 
		'description': 'expected close status, received none'
	},
	'1006' : {
		'reason': 'CLOSE_ABNORMAL', 
		'description': 'no close code frame has been received'
	},
	'1007' : {
		'reason': 'UNSUPPORTED_PAYLOAD', 
		'description': 'endpoint received an inconsistent message'
	},
	'1008' : {
		'reason': 'POLICY_VIOLATION', 
		'description': 'generic code used for situations other than 1003 and 1009'
	},
	'1009' : {
		'reason': 'CLOSE_TOO_LARGE', 
		'description': 'endpoint won’t process large frame'
	},
	'1010' : {
		'reason': 'MANDATORY_EXTENSION', 
		'description': 'client wanted an extension which server did not negotiate'
	},
	'1011' : {
		'reason': 'SERVER_ERROR', 
		'description': 'internal server error while operating'
	},
	'1012' : {
		'reason': 'SERVICE_RESTART', 
		'description': 'service is restarting'
	},
	'1013' : {
		'reason': 'TRY_AGAIN_LATER', 
		'description': 'temporary server condition forced blocking client’s request'
	},
	'1014' : {
		'reason': 'BAD_GATEWAY', 
		'description': 'server acting as gateway received an invalid response'
	},
	'1015' : {
		'reason': 'TLS_HANDSHAKE_FAIL', 
		'description': 'transport Layer Security handshake failure'
	},
]
*/

const events = [
	'raw',
	'warn',
	'error',
	'debug',
	'ready',
	'rateLimit',
	'shardError',
	'cacheSweep',
	'apiRequest',
	'shardReady',
	'shardResume',
	'invalidated',
	'apiResponse',
	'webhookUpdate',
	'shardDisconnect',
	'voiceStateUpdate',
	'shardReconnecting',
	'voiceServerUpdate',
	'invalidRequestWarning',
]

/**
 * Loads the event listeners from the DISCORD API WS on the client 
 * @param {Client} client 
 */
const LoadDebugListeners = (client) => {
	if (client.OPLevel >= 2) {
		client.warn('Loading debug listeners...')
		for (const listener of events) {
			client.on(listener, (...data) => {
				client.debug("> devDebug", listener, ...data);
			})
		}
		client.info('Loaded debug listeners!')
	}
};

/**
 * Loads appropiate error handlers based on config of the client
 * @param {Client} client
 */
function LoadErrorHandler(client) {
	client.warn('Loading error handlers...');
	if (client.OPLevel >= 1) {
		process.on("unhandledRejection", (reason, promise) => {
			client.error(`[FATAL] Possibly Unhandled Rejection\n\tReason: ${reason}\n`);
			console.log(promise);
		});
		process.on("uncaughtException", (reason, promise) => {
			client.error(`[FATAL] Possibly Uncaught Exception\n\tReason: ${reason}\n`);
			console.log(promise);
		});
		client.info('Loaded debug error handlers!');
	} else {
		// Puts listener but never gets used (reduced clutter and dispels catch clauses)
		const inhibitedLogString = "\tSomething happened, activate debug mode to see more details.";
		process.on("unhandledRejection", () => console.log(inhibitedLogString));
		process.on("uncaughtException", () => console.log(inhibitedLogString));
		client.error('Error handlers inhibited!');
	}
};

module.exports = {
	LoadDebugListeners,
	LoadErrorHandler,
}