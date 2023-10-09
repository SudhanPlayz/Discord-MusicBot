import { CosmiTrack } from "cosmicord.js";
import { Player, Track } from "erela.js";
import { CosmicordPlayerExtended } from "./clients/MusicClient";

export interface IHandleTrackStartParams {
	player: CosmicordPlayerExtended | Player;
	track: CosmiTrack | Track;
}

export function handleTrackStart(params: IHandleTrackStartParams): void;
