import { WS_URL } from '@/configs/constants';

let socket: WebSocket | undefined;
let connURL: string | undefined;
let handleClose: typeof closeHandler | undefined;

function openHandler(e: Event) {
    console.log('Connection established:', connURL);
}

function messageHandler(e: MessageEvent<string>) {
    console.log('MESSAGE');
    console.log({ event: e, data: e.data });
    // !TODO
}

function closeHandler(e: CloseEvent) {
    console.log('Connection closed:', connURL);

    if (handleClose) handleClose(e);
}

function errorHandler(...args: any[]) {
    console.error('ERROR:', connURL);
    console.error(...args);
}

export function mount(serverId: string, onClose?: typeof closeHandler) {
    if (!serverId?.length) return;

    connURL = `${WS_URL}/player/${serverId}`;
    handleClose = onClose;

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

    handleClose = undefined;
    connURL = undefined;
}

export function getSocket() {
    return socket;
}
