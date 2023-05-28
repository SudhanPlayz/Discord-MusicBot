import { Manager } from "erela.js";
import { Shoukaku } from "shoukaku";

interface MusicClient extends Manager, Shoukaku {
	public createPlayer(...props: any[]): 
		import("erela.js").Player | 
		import("shoukaku").Player;

	get leastUsedNode(): 
		import("erela.js").Node | 
		import("shoukaku").Node;
}