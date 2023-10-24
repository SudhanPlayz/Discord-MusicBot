import type {
	ClientEvents,
	CommandInteractionOptionResolver,
	Message,
	PermissionResolvable,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import Bot from "./Bot";

type InteractionEvent = ClientEvents["interactionCreate"][0];

type RunCallback<T> = (
	client: Bot,
	interaction: InteractionEvent,
	options: CommandInteractionOptionResolver
) => T;

type AutocompleteOptionsCallback = (
	input: string,
	index: number,
	interaction: InteractionEvent,
	client: Bot
) => Promise<
	{
		name: string;
		value: string;
	}[]
>;

type PermissionsConfig = (
	| {
			permission: PermissionResolvable;
			message?: string;
	  }
	| PermissionResolvable
)[];

interface SubCommandConfig<T> {
	run: RunCallback<T>;
	ownerOnly: boolean | undefined;
	usesDb: boolean | undefined;
	usage: string | undefined;
	permissions: PermissionsConfig | undefined;
	botPermissions: PermissionsConfig | undefined;
	autocompleteOptions: AutocompleteOptionsCallback | undefined;
	subCommands: Map<string, SubCommandConfig<T>> | undefined;
}

declare class SubSlashCommand<T = unknown> extends SlashCommandSubcommandBuilder {
	
	autocompleteOptions: AutocompleteOptionsCallback | undefined;


	constructor();

	/**
	 * Set the available autocomplete options for a string command option
	 */
	setAutocompleteOptions(autocompleteOptions: AutocompleteOptionsCallback): this;
}

declare class SlashCommand<T = unknown> extends SlashCommandBuilder {
	type: number;
	run: RunCallback<T>;
	ownerOnly: boolean | undefined;
	usesDb: boolean | undefined;
	usage: string | "" | undefined;
	category: string | "misc" | undefined;
	permissions: PermissionsConfig | undefined;
	botPermissions: PermissionsConfig | undefined;
	autocompleteOptions: AutocompleteOptionsCallback | undefined;
	subCommands: Map<string, SubCommandConfig<T>> | undefined;

	constructor();

	/**
	 * Overrides the Builder class' addSubcommand method to return a SubSlashCommand
	 */
	addSubSlashCommand(input: SubSlashCommand | ((subcommandGroup: SubSlashCommand) => SubSlashCommand)): SubSlashCommand<T>;

	/**
	 * sets the command run function
	 */
	setRun(callback: this["run"]): this;

	/**
	 * sets a command to be owner accessible only
	 */
	setOwnerOnly(): this;

	/**
	 * tells the the command if it's using DBMS or not
	 */
	setDBMS(): this;

	/**
	 * sets the intended usage for a command as a string, which will be grabbed by the `help` command
	 * syntax: /<commandName> <args?...>
	 */
	setUsage(usage?: string): this;

	/**
	 * sets the intended category for the command, useful for finding mismatches
	 */
	setCategory(category?: string): this;

	/**
	 * Set user permissions required to run this command
	 */
	setPermissions(permissions?: this["permissions"]): this;

	/**
	 * Set bot permissions required to run this command
	 */
	setBotPermissions(permissions?: this["botPermissions"]): this;

	/**
	 * Set the available autocomplete options for a string command option
	 */
	setAutocompleteOptions(autocompleteOptions: AutocompleteOptionsCallback): this;

	setSubCommandConfig(
		name: string,
		key: keyof SubCommandConfig<T>,
		value: SubCommandConfig<T>[typeof key]
	): boolean | undefined;

	getSubCommandConfig<K = undefined>(
		name: string,
		key?: K
	): K extends keyof SubCommandConfig<T>
		? SubCommandConfig<T>[K] | undefined
		: SubCommandConfig<T> | undefined;

	/**
	 * @discordjs/builders doesn't export SlashSubCommandBuilder class so we can't modify it
	 * We have to implement subcommand handler in the main class
	 */
	handleSubCommandInteraction: this["run"];

	handleSubCommandAutocomplete(interaction: InteractionEvent): void;

	setSubCommandHandler(name: string, cb: SubCommandConfig<T>["run"]): this;

	getSubCommandHandler(name: string): SubCommandConfig<T>["run"] | undefined;

	setSubCommandPermissions(
		name: string,
		permissions?: SubCommandConfig<T>["permissions"]
	): this;

	getSubCommandPermissions(name: string): SubCommandConfig<T>["permissions"];

	setSubCommandBotPermissions(
		name: string,
		permissions?: SubCommandConfig<T>["botPermissions"]
	): this;

	getSubCommandBotPermissions(name: string): SubCommandConfig<T>["botPermissions"];

	static checkConfigs<T = unknown>(
		config: SlashCommand<T> | SubCommandConfig<T>,
		interaction: InteractionEvent
	): Promise<Message> | undefined;

	static checkAutocomplete(interaction: InteractionEvent): Promise<void> | undefined;

	static checkPermission<T = unknown>(
		config: SlashCommand<T> | SubCommandConfig<T>,
		interaction: InteractionEvent
	): Promise<Message> | undefined;

	static handleComponentInteraction(
		interaction: InteractionEvent
	): Promise<Message | undefined>;
}

export = SlashCommand;
