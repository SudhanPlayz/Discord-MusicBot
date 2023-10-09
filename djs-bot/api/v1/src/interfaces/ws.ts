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

// these 2 interface are just dumb
export interface ICosmiTrack {
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

// !TODO: Need to unify these, or maybe just use the common prop between both
export interface IErelaTrack {
  track: string;
  title: string;
  identifier: string;
  author: string;
  duration: number;
  isSeekable: boolean;
  isStream: boolean;
  uri: string;
  thumbnail: string | null;
  requester: unknown;
}

export type ITrack = ICosmiTrack | IErelaTrack;

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
  d: ISocketData[K] | null;
}
