import Bot from "../Bot";
import { Message } from "discord.js";
import {
	CosmiNode,
	CosmiPlayerOptions,
	CosmiSearchQuery,
	Cosmicord,
	CosmiLoadedTracks,
	CosmiPlayer,
} from "cosmicord.js";

export interface CosmicordPlayerExtended extends CosmiPlayer {
	search(query: CosmiSearchQuery, requesterId?: string): Promise<CosmiLoadedTracks>;
	setResumeMessage(client: Bot, message: Message): Message<boolean>;
	setPausedMessage(client: Bot, message: Message): Message<boolean>;
	setNowplayingMessage(client: Bot, message: Message): Message<boolean>;

	/** The guild id of the player */
	get guild(): string;
}

// this interface is confusing looking at its usage as `bot.manager`
export interface MusicClient extends Cosmicord {
	// `this` is wrong and only here for quick type workaround, also why does it extends Cosmicord
	// !TODO: declare proper type for these extended class
	Engine: this; // CosmicordExtended | ErelaExtended;

	createPlayer(options: CosmiPlayerOptions, node?: CosmiNode): CosmicordPlayerExtended;

	get leastUsedNode(): CosmiNode;
}

export enum Engine {
	"Cosmicord" = "Cosmicord",
	"Erela" = "Erela",
}
