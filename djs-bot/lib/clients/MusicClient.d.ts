import { CosmiNode, CosmiPlayerOptions, CosmiSearchQuery, Cosmicord, CosmiLoadedTracks } from "cosmicord.js";

interface CosmicordPlayerExtended extends CosmiPlayer {
  search(query: CosmiSearchQuery, requesterId?: string): Promise<CosmiLoadedTracks>;
}

export interface MusicClient extends Cosmicord {
  createPlayer(options: CosmiPlayerOptions, node?: CosmiNode): CosmicordPlayerExtended;

  get leastUsedNode(): CosmiNode;
}

export enum Engine {
  "Cosmicord" = "Cosmicord",
  "Erela" = "Erela",
}