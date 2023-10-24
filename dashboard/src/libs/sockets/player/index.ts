import { WS_URL } from '@/configs/constants';
import { IPlayerWSMountOptions } from '@/interfaces/ws';
import { ESocketEventType, ISocketEvent } from '@/interfaces/wsShared';
import {
    eventHandlersMount,
    getEventHandlers,
    getHandlers,
    getOptions,
    getSocket,
    handlersMount,
    optionsMount,
    setSocket,
    statesUnmount,
} from './states';

function eventHandler<T extends ESocketEventType>(e: ISocketEvent<T>) {
    const eventHandlers = getEventHandlers();
    const opt = getOptions();

    const handler = eventHandlers[e.e];

    if (!handler) {
        if (opt.logUnhandledEvent) {
            console.error(new TypeError('No handler defined for payload:'));
            console.error(e);
        }
        return;
    }

    handler(e);
}

function openHandler(e: Event) {
    const handlers = getHandlers();
    const opt = getOptions();

    console.log('Connection established:', opt.connURL);

    if (handlers.open) handlers.open(e);
}

function messageHandler(e: MessageEvent<string>) {
    const handlers = getHandlers();

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
    const handlers = getHandlers();
    const opt = getOptions();

    console.log('Connection closed:', opt.connURL);

    if (handlers.close) handlers.close(e);
}

function errorHandler(e: Event) {
    const handlers = getHandlers();
    const opt = getOptions();

    console.error('ERROR:', opt.connURL);
    console.error(e);

    if (handlers.error) handlers.error(e);
}

export function mount(
    serverId: string,
    {
        mountHandler = {},
        eventHandler = {},
        logUnhandledEvent,
    }: IPlayerWSMountOptions = {},
) {
    if (!serverId?.length) return;

    const opt = getOptions();

    optionsMount({
        connURL: `${WS_URL}/player/${serverId}`,
        logUnhandledEvent,
    });

    handlersMount(mountHandler);
    eventHandlersMount(eventHandler);

    console.log('Connecting:', opt.connURL);
    if (!opt.connURL?.length) throw new TypeError('Invalid connURL');

    const socket = new WebSocket(opt.connURL);
    setSocket(socket);

    socket.addEventListener('open', openHandler);
    socket.addEventListener('message', messageHandler);
    socket.addEventListener('close', closeHandler);
    socket.addEventListener('error', errorHandler);
}

export function unmount(serverId: string) {
    const socket = getSocket();

    if (!serverId?.length || !socket) return;

    socket.removeEventListener('close', closeHandler);
    socket.removeEventListener('open', openHandler);
    socket.removeEventListener('message', messageHandler);
    socket.close();
    socket.removeEventListener('error', errorHandler);

    setSocket(undefined);

    statesUnmount();
}
