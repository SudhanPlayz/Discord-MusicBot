export interface IPlayerSocket {
  serverId: string;
}

export const enum ESocketEventType {
  SEEK,
  GET_QUEUE,
  SEARCH,
  ADD_TRACK,
  PLAYING,
  PLAY,
  PAUSE,
}

export interface ITrack {
  duration: number;
  requesterId?: string | undefined;
  encoded?: string | undefined;
  identifier: string;
  isSeekable: boolean;
  author: string;
  length: number;
  isStream: boolean;
  position: number;
  title: string;
  sourceName: string;
  uri?: string | undefined;
}

export interface ISocketData {
  [ESocketEventType.SEEK]: {
    // !TODO: lavalink seeking with string or number?
    t: string;
  };
  [ESocketEventType.GET_QUEUE]: ITrack[];
  [ESocketEventType.SEARCH]: {
    // query
    q: string;
  };
  [ESocketEventType.ADD_TRACK]: {
    // !TODO: track data
  };
  [ESocketEventType.PLAYING]: ITrack;
  [ESocketEventType.PLAY]: null;
  [ESocketEventType.PAUSE]: null;
  // !TODO: other events
}

export interface ISocketEvent<K extends ESocketEventType> {
  e: K;
  d: ISocketData[K];
}
