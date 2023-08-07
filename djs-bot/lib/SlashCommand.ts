// Starts refactoring to typescript while using old JS files
// until every file has become ts file
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from "discord.js";
import Bot from "./Bot";

export type RunCallback<T> = (
  client: Bot,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => T;

export type AutocompleteOptionsCallback = (
  input: string,
  index: number,
  interaction: CommandInteraction,
  client: Bot
) => Promise<{ name: string; value: string }[]>;

// https://discordjs.guide/popular-topics/builders.html#slash-command-builders

// Extending the main discord.js slash command builder class to facilitate the
// construction of commands using methods instead of properties
class SlashCommand<T = unknown> extends SlashCommandBuilder {
  type: number;
  run: RunCallback<T>;
  ownerOnly: boolean | undefined;
  usesDb: boolean | undefined;
  usage: string | "";
  category: string | "misc";
  permissions: unknown[];
  autocompleteOptions: AutocompleteOptionsCallback;

  constructor() {
    super();
    this.type = 1; // "CHAT_INPUT"
    return this;
  }

  /**
   * sets the command run function
   */
  setRun(callback: RunCallback<T>) {
    this.run = callback;
    return this;
  }

  /**
   * sets a command to be owner accessible only
   */
  setOwnerOnly() {
    this.ownerOnly = true;
    return this;
  }

  /**
   * tells the the command if it's using DBMS or not
   */
  setDBMS() {
    this.usesDb = true;
    return this;
  }

  /**
   * sets the intended usage for a command as a string, which will be grabbed by the `help` command
   * syntax: /<commandName> <args?...>
   */
  setUsage(usage = "") {
    this.usage = usage;
    return this;
  }

  /**
   * sets the intended category for the command, useful for finding mismatches
   */
  setCategory(category = "misc") {
    this.category = category;
    return this;
  }

  /**
   * Set permissions for a command
   */
  setPermissions(permissions: unknown[] = []) {
    // this method isn't even used anywhere wtf is the point??
    this.permissions = permissions;
    return this;
  }

  /**
   * Set the available autocomplete options for a string command option
   */
  setAutocompleteOptions(autocompleteOptions: AutocompleteOptionsCallback) {
    this.autocompleteOptions = autocompleteOptions;
    return this;
  }
}

export default SlashCommand;
