import { ClientEvents } from "discord.js";

export function reply(
	interaction: ClientEvents["interactionCreate"][0],
	desc: string
): Promise<void>;
