import { CosmiPlayer } from "cosmicord.js";
import { GuildMember } from "discord.js";
import { IUsingPlayer } from "../lib/MusicEvents";

export function triggerSocketQueueUpdate(player: IUsingPlayer): void;

export function spliceQueue(
	player: IUsingPlayer,
	...restArgs: Parameters<IUsingPlayer["queue"]["splice"]>
): ReturnType<IUsingPlayer["queue"]["splice"]>;

export function clearQueue(player: IUsingPlayer): ReturnType<IUsingPlayer["queue"]["clear"]>;

export function removeTrack(
	player: IUsingPlayer,
	...restArgs: Parameters<IUsingPlayer["queue"]["remove"]>
): ReturnType<IUsingPlayer["queue"]["remove"]>;

export function shuffleQueue(player: IUsingPlayer): ReturnType<IUsingPlayer["queue"]["shuffle"]>;

export function playPrevious(player: CosmiPlayer): Promise<number>;

export function stop(player: CosmiPlayer): number;

export function skip(player: CosmiPlayer): number;

export function joinStageChannelRoutine(me: GuildMember): void;

export function addTrack(
	player: IUsingPlayer,
	tracks: Parameters<IUsingPlayer["queue"]["add"]>[0]
): ReturnType<IUsingPlayer["queue"]["add"]>;

export function triggerSocketPause(player: IUsingPlayer, state: boolean): void;

export function pause(player: IUsingPlayer, state: boolean): ReturnType<IUsingPlayer["pause"]>;
