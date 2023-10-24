import { useState } from 'react';
import { ITrack } from '../wsShared';

export interface IPlaylistBarProps {
    queue: ITrack[];
    setQueue: ReturnType<typeof useState<ITrack[]>>[1];
    hide?: boolean;
}
