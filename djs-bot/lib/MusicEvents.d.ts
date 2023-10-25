import { CosmiTrack } from "cosmicord.js";
import { Track } from "erela.js";
import { CosmicordPlayerExtended } from "../lib/clients/MusicClient";
import { VoiceState } from "discord.js";

export type IUsingPlayer = CosmicordPlayerExtended;

export interface IHandleStopParams {
	player: IUsingPlayer;
}

export interface IHandleTrackStartParams {
	player: IUsingPlayer;
	track: CosmiTrack | Track;
}

export interface IHandleQueueUpdateParams {
	guildId: string;
	player: IUsingPlayer;
}

export interface IHandlePauseParams {
	player: IUsingPlayer;
	state: boolean;
}

export function handleStop(params: IHandleStopParams): void;

export function handleTrackStart(params: IHandleTrackStartParams): void;

export function handleQueueUpdate(params: IHandleQueueUpdateParams): void;

export function updateProgress(params: IHandleTrackStartParams): void;

export function stopProgressUpdater(guildId: string): void;

export function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): void;

export function handlePause(params: IHandlePauseParams): void;
