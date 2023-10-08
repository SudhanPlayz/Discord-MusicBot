export interface IPlayerSocket {
  serverId: string;
}

export const enum ESocketEventType {
  SEEK,
  GET_QUEUE,
  SEARCH,
  ADD_TRACK,
}

export interface ISocketData {
  [ESocketEventType.SEEK]: {
    // !TODO: lavalink seeking with string or number?
    t: string;
  };
  [ESocketEventType.GET_QUEUE]: null;
  [ESocketEventType.SEARCH]: {
    // query
    q: string;
  };
  [ESocketEventType.ADD_TRACK]: {
    // !TODO: track data
  };
  // !TODO: other events
}

export interface ISocketEvent<K extends ESocketEventType> {
  e: K;
  d: ISocketData[K];
}
