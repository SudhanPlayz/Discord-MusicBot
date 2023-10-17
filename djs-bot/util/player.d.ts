import { CosmiPlayer, CosmiQueue, CosmiTrack } from "cosmicord.js";
import { GuildMember } from "discord.js";
import { CosmicordPlayerExtended } from "../lib/clients/MusicClient";

export function playPrevious(player: CosmiPlayer): Promise<number>;

export function stop(player: CosmiPlayer): number;

export function skip(player: CosmiPlayer): number;

export function joinStageChannelRoutine(me: GuildMember): void;

export function addTrack(
	player: CosmicordPlayerExtended,
	tracks: CosmiTrack | CosmiTrack[]
): CosmiQueue;
