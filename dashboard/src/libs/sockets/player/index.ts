import { WS_URL } from '@/configs/constants';
import { ESocketEventType, ISocketEvent } from '@/interfaces/wsShared';

export interface IPlayerSocketHandlers {
    close?: typeof closeHandler;
    open?: typeof openHandler;
    message?: typeof messageHandler;
    error?: typeof errorHandler;
}

let socket: WebSocket | undefined;
let connURL: string | undefined;

const handlers: IPlayerSocketHandlers = {};

function eventHandler<T extends ESocketEventType>(e: ISocketEvent<T>) {
    switch (e.e) {
        // !TODO
        case ESocketEventType.GET_QUEUE:
            // handleGetQueue
            break;
        case ESocketEventType.PLAYING:
            break;
        case ESocketEventType.SEARCH:
            break;
        case ESocketEventType.SEEK:
            break;
        default:
        // log error
    }
}

function openHandler(e: Event) {
    console.log('Connection established:', connURL);

    if (handlers.open) handlers.open(e);
}

function messageHandler(e: MessageEvent<string>) {
    console.log('MESSAGE');
    console.log({ event: e, data: e.data });

    if (handlers.message) handlers.message(e);

    if (e.data === '0') {
        // ping reply, do nothig
        return;
    }

    try {
        const payload = JSON.parse(e.data);

        if (typeof payload?.e !== 'number') {
            console.error(new TypeError('Unexpected event payload received:'));
            console.error(payload);
            return;
        }

        eventHandler(payload);
    } catch (e) {
        console.error(e);
    }
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
