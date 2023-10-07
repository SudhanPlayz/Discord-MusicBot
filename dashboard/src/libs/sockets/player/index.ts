import { WS_URL } from '@/configs/constants';

let socket: WebSocket | undefined;

export function mount(serverId: string) {
    if (!serverId?.length) return;

    socket = new WebSocket(`${WS_URL}/player/${serverId}`);

    // !TODO: attach events listener
}

export function unmount(serverId: string) {
    if (!serverId?.length || !socket) return;

    if (socket.readyState === socket.OPEN) socket.close();

    socket = undefined;
}

export function getSocket() {
    return socket;
}
