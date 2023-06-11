import Bot from "../Bot";
import { Message } from "discord.js";
import { CosmiNode, CosmiPlayerOptions, CosmiSearchQuery, Cosmicord, CosmiLoadedTracks } from "cosmicord.js";

interface CosmicordPlayerExtended extends CosmiPlayer {
  search(query: CosmiSearchQuery, requesterId?: string): Promise<CosmiLoadedTracks>;
  setResumeMessage(client: Bot, message: Message): Message<boolean>;
  setPausedMessage(client: Bot, message: Message): Message<boolean>;
  setNowplayingMessage(client: Bot, message: Message): Message<boolean>;

  /** The guild id of the player */
  get guild(): string;

}

export interface MusicClient extends Cosmicord {
  createPlayer(options: CosmiPlayerOptions, node?: CosmiNode): CosmicordPlayerExtended;

  get leastUsedNode(): CosmiNode;
}

export enum Engine {
  "Cosmicord" = "Cosmicord",
  "Erela" = "Erela",
}