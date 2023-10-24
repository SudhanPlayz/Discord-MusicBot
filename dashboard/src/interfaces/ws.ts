import { ESocketEventType, ISocketEvent } from './wsShared';

export interface IPlayerSocketOptions {
    connURL?: string;
    logUnhandledEvent?: boolean;
}

export interface IPlayerSocketHandlers {
    close?: (e: CloseEvent) => void;
    open?: (e: Event) => void;
    message?: (e: MessageEvent<string>) => void;
    error?: (e: Event) => void;
}

export type IPlayerEventHandlers = {
    [K in ESocketEventType]?: (e: ISocketEvent<K>) => void;
};

export interface IPlayerWSMountOptions {
    mountHandler?: IPlayerSocketHandlers;
    eventHandler?: IPlayerEventHandlers;
    logUnhandledEvent?: boolean;
}
