////////////////////////////////////////////////////////////////////////////////////////////////////
// "Shared Utils"
// Must be in sync with dashboard utils
////////////////////////////////////////////////////////////////////////////////////////////////////

import {
  ESocketErrorCode,
  ESocketEventType,
  IConstructITrackOptions,
  ISocketData,
  ISocketEvent,
  ITrack,
} from '../interfaces/wsShared';

export function createErrPayload<K extends ESocketErrorCode>(
  code: K,
  message?: string,
): ISocketEvent<ESocketEventType.ERROR> {
  return {
    e: ESocketEventType.ERROR,
    d: { code, message },
  };
}

export function createEventPayload<K extends ESocketEventType>(
  e: K,
  d: ISocketData[K] | null = null,
) {
  return {
    e,
    d,
  };
}

export function processTrackThumbnail(track: ITrack, hq?: boolean) {
  return track.thumbnail?.replace(
    'default.',
    hq ? 'hqdefault.' : 'maxresdefault.',
  );
}

export function constructITrack({
  track,
  id,
  hqThumbnail,
}: IConstructITrackOptions) {
  return {
    ...track,
    thumbnail: processTrackThumbnail(track, hqThumbnail),
    id,
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
