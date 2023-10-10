import { WS_URL } from '@/configs/constants';

export interface IPlayerSocketHandlers {
    close?: typeof closeHandler;
    open?: typeof openHandler;
    message?: typeof messageHandler;
    error?: typeof errorHandler;
}

let socket: WebSocket | undefined;
let connURL: string | undefined;

const handlers: IPlayerSocketHandlers = {};

function openHandler(e: Event) {
    console.log('Connection established:', connURL);

    if (handlers.open) handlers.open(e);
}

function messageHandler(e: MessageEvent<string>) {
    console.log('MESSAGE');
    console.log({ event: e, data: e.data });
    // !TODO

    if (handlers.message) handlers.message(e);
}

function closeHandler(e: CloseEvent) {
    console.log('Connection closed:', connURL);

    if (handlers.close) handlers.close(e);
}

function errorHandler(...args: any[]) {
    console.error('ERROR:', connURL);
    console.error(...args);

    if (handlers.error) handlers.error(...args);
}

export function mount(serverId: string, mountHandler: IPlayerSocketHandlers) {
    if (!serverId?.length) return;

    connURL = `${WS_URL}/player/${serverId}`;
    handlers.close = mountHandler.close;
    handlers.open = mountHandler.open;
    handlers.message = mountHandler.message;
    handlers.error = mountHandler.error;

    console.log('Connecting:', connURL);
    socket = new WebSocket(connURL);

    socket.addEventListener('open', openHandler);
    socket.addEventListener('message', messageHandler);
    socket.addEventListener('close', closeHandler);
    socket.addEventListener('error', errorHandler);
}

export function unmount(serverId: string) {
    if (!serverId?.length || !socket) return;

    socket.removeEventListener('close', closeHandler);
    socket.removeEventListener('open', openHandler);
    socket.removeEventListener('message', messageHandler);
    socket.close();
    socket.removeEventListener('error', errorHandler);

    socket = undefined;

    handlers.close = undefined;
    handlers.open = undefined;
    handlers.message = undefined;
    handlers.error = undefined;

    connURL = undefined;
}

export function getSocket() {
    return socket;
}
