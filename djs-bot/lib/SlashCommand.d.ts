import type {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from "discord.js";
import Bot from "./Bot";

type RunCallback<T> = (
  client: Bot,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => T;

type AutocompleteOptionsCallback = (
  input: string,
  index: number,
  interaction: CommandInteraction,
  client: Bot
) => Promise<
  {
    name: string;
    value: string;
  }[]
>;

declare class SlashCommand<T = unknown> extends SlashCommandBuilder {
  type: number;
  run: RunCallback<T> | undefined;
  ownerOnly: boolean | undefined;
  usesDb: boolean | undefined;
  usage: string | "" | undefined;
  category: string | "misc" | undefined;
  permissions: unknown[];
  autocompleteOptions: AutocompleteOptionsCallback | undefined;

  constructor();

  /**
   * sets the command run function
   */
  setRun(callback: RunCallback<T>): this;

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
   * Set permissions for a command
   */
  setPermissions(permissions?: unknown[]): this;

  /**
   * Set the available autocomplete options for a string command option
   */
  setAutocompleteOptions(
    autocompleteOptions: AutocompleteOptionsCallback
  ): this;
}

export = SlashCommand;
