import { Manager } from "erela.js";

interface MusicClient extends Manager {
  createPlayer(...props: any[]): import("erela.js").Player;

  get leastUsedNode(): import("erela.js").Node;
}
