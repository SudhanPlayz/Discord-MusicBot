import { Client, Message, ClientOptions, Collection } from "discord.js";
import SlashCommand from "./SlashCommand";
import Logger from "./Logger";
import MusicManager from "./MusicManager";
import DBMS from "./DBMS";
import prettyMilliseconds from "pretty-ms";
import { CosmiTrack } from "cosmicord.js";
import config from "../config";
import app from "../api/v1";

/**
 * The class groups some useful functions for the client in order to facilitate expandability, maintenance and manageability
 * as well as initialize the bot through it's proprietary methods
 */
declare class Bot extends Client {
  slash: Collection<SlashCommand["name"], SlashCommand>;
  logger: Logger;
  OPLevel: number;
  config: typeof config;
  ms: typeof prettyMilliseconds;
  deletedMessages: WeakSet<Message>;
  playedTracks: Array<CosmiTrack>;

  /**
   * Denomination (name) of the bot
   */
  denom: string | undefined;
  manager: MusicManager | undefined;
  api: ReturnType<typeof app>;
  db: DBMS | undefined;

  /**
   * This is really the only thing that the DJS API needs to start and log in to
   * the bot application (with the login method in `this.build`),
   * all the other methods and functions are for commodity and EoA
   * https://discordjs.guide/popular-topics/intents.html#privileged-intents
   * https://discord.com/developers/docs/topics/gateway
   */
  constructor(clientOptions?: ClientOptions);

  /**
   * Console logging => "../logs.log"
   * Refer to `./Logger.js`
   * These methods are just for convenience
   */
  log(...data: any[]): void;
  warn(...data: any[]): void;
  info(...data: any[]): void;
  error(...data: any[]): void;
  silly(...data: any[]): void;
  debug(...data: any[]): void;

  printBotInfo(): void;
  boot(): void;
  LoadEvents(): void;
  LoadSchedules(): void;
  LoadCommands(): void;

  /**
   * Checks if a message has been deleted during the run time of the Bot
   */
  isMessageDeleted(message: Message): boolean;

  /**
   * Marks (adds) a message on the client's `deletedMessages` WeakSet so it's
   * state can be seen through the code
   */
  markMessageAsDeleted(message: Message): Bot["deletedMessages"];
}

export = Bot;
