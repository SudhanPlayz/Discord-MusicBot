import { CosmiTrack } from "cosmicord.js";
import { Track } from "erela.js";
import { CosmicordPlayerExtended } from "../lib/clients/MusicClient";

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

export function handleStop(params: IHandleStopParams): void;

export function handleTrackStart(params: IHandleTrackStartParams): void;

export function handleQueueUpdate(params: IHandleQueueUpdateParams): void;
