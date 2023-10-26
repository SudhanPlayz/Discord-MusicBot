import {
    IPlayerEventHandlers,
    IPlayerSocketHandlers,
    IPlayerSocketOptions,
} from '@/interfaces/ws';

let socket: WebSocket | undefined;

const opts: IPlayerSocketOptions = {};
const handlers: IPlayerSocketHandlers = {};
const eventHandlers: IPlayerEventHandlers = {};

function mountState<T>(state: T, newState: T) {
    for (const k in newState) {
        state[k] = newState[k];
    }
}

function unmountState<T>(s: T) {
    for (const k in s) {
        // @ts-ignore
        s[k] = undefined;
    }
}

export function getSocket() {
    return socket;
}

export function setSocket(v: typeof socket) {
    socket = v;
}

export function getOptions() {
    return opts;
}

export function getHandlers() {
    return handlers;
}

export function getEventHandlers() {
    return eventHandlers;
}

export function optionsMount(v: typeof opts) {
    mountState(opts, v);
}

export function handlersMount(v: typeof handlers) {
    mountState(handlers, v);
}

export function eventHandlersMount(v: typeof eventHandlers) {
    mountState(eventHandlers, v);
}

export function optionsUnmount() {
    unmountState(opts);
}

export function handlersUnmount() {
    unmountState(handlers);
}

export function eventHandlersUnmount() {
    unmountState(eventHandlers);
}

export function statesUnmount() {
    handlersUnmount();
    eventHandlersUnmount();
    optionsUnmount();
}

export function sendJson(json: object) {
    // silently fail if socket unitialized
    socket?.send(JSON.stringify(json));
}
